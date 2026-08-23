"""Flask WSGI adapter for AnyMHost cPanel / Phusion Passenger.

FastAPI (app.main) remains the primary implementation for local dev and
Docker/Render. This module exposes the same public API contract
(GET /, GET /health, POST /predict, POST /predict/batch) over WSGI for hosts
that only support Passenger, by reusing the framework-independent ML and
validation code in app.model / app.schemas — no inference logic is
duplicated here.
"""
import io
import json
import logging

import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import ValidationError

from .config import settings
from .constants import BATCH_INPUT_COLS
from .model import (
    ModelNotLoadedError,
    build_input_df,
    compute_percentages,
    get_load_error,
    get_model,
    is_model_loaded,
    load_model,
    predict_dataframe,
)
from .schemas import SoilSample

logger = logging.getLogger(__name__)

load_model()

app = Flask(__name__)
CORS(app, origins=settings.cors_origins)


def _prediction_result_dict(result: dict, pct_ca: float, pct_mg: float, pct_k: float) -> dict:
    return {
        "label": result["label"],
        "class_index": result["class_index"],
        "confidence": result["confidence"],
        "percent_ca": pct_ca,
        "percent_mg": pct_mg,
        "percent_k": pct_k,
    }


@app.get("/")
def root():
    return jsonify({"service": "AgroSense API", "docs": "/docs"})


@app.get("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": is_model_loaded(),
            "model_error": get_load_error(),
        }
    )


@app.post("/predict")
def predict_single():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"detail": [{"msg": "Invalid or missing JSON body.", "loc": ["body"], "type": "json_invalid"}]}), 422

    try:
        sample = SoilSample(**body)
    except ValidationError as exc:
        # exc.errors() can embed raw exception objects in ctx (e.g. from a
        # model_validator raising ValueError), which json.dumps can't
        # serialize. exc.json() is pydantic's own JSON-safe rendering.
        return app.response_class(
            json.dumps({"detail": json.loads(exc.json())}), status=422, mimetype="application/json"
        )

    try:
        model = get_model()
    except ModelNotLoadedError as exc:
        return jsonify({"detail": str(exc)}), 503

    pct_ca, pct_mg, pct_k = compute_percentages(sample.Ca, sample.Mg, sample.K, sample.Na)
    df = build_input_df(
        P=sample.P, SAND=sample.SAND, CLAY=sample.CLAY, N=sample.N, K=sample.K,
        Ca=sample.Ca, Mg=sample.Mg, Na=sample.Na, CEC=sample.CEC, SAR=sample.SAR, ESP=sample.ESP,
    )

    try:
        result = predict_dataframe(model, df)[0]
    except KeyError as exc:
        logger.exception("Prediction failed: missing column")
        return jsonify({"detail": f"Model expects a column the request didn't provide: {exc}"}), 500
    except Exception as exc:
        logger.exception("Prediction failed")
        return jsonify({"detail": f"Prediction failed: {exc}"}), 500

    return jsonify(_prediction_result_dict(result, pct_ca, pct_mg, pct_k))


@app.post("/predict/batch")
def predict_batch():
    file = request.files.get("file")
    if file is None or not (file.filename or "").lower().endswith(".csv"):
        return jsonify({"detail": "Please upload a .csv file."}), 400

    raw_bytes = file.read()
    try:
        df = pd.read_csv(io.BytesIO(raw_bytes))
    except Exception as exc:
        return jsonify({"detail": f"Could not read CSV: {exc}"}), 400

    missing_cols = [c for c in BATCH_INPUT_COLS if c not in df.columns]
    if missing_cols:
        return jsonify({"detail": f"Missing columns: {', '.join(missing_cols)}"}), 422

    non_numeric = [c for c in BATCH_INPUT_COLS if not pd.api.types.is_numeric_dtype(df[c])]
    if non_numeric:
        return jsonify(
            {
                "detail": f"Non-numeric values found in: {', '.join(non_numeric)}. "
                          f"Please ensure all columns contain numbers."
            }
        ), 422

    rows_with_nan = df[BATCH_INPUT_COLS].isnull().any(axis=1)
    if rows_with_nan.any():
        bad_rows = list(rows_with_nan[rows_with_nan].index + 2)
        return jsonify(
            {
                "detail": f"Missing values detected in rows: {bad_rows}. "
                          f"Please fill or remove incomplete rows before uploading."
            }
        ), 422

    try:
        model = get_model()
    except ModelNotLoadedError as exc:
        return jsonify({"detail": str(exc)}), 503

    pct = df.apply(lambda r: compute_percentages(r["Ca"], r["Mg"], r["K"], r["Na"]), axis=1, result_type="expand")
    df["% Ca"], df["% Mg"], df["% K"] = pct[0], pct[1], pct[2]

    try:
        raw_results = predict_dataframe(model, df)
    except Exception as exc:
        logger.exception("Batch prediction failed")
        return jsonify({"detail": f"Prediction error: {exc}"}), 500

    results = [
        _prediction_result_dict(r, df["% Ca"].iloc[i], df["% Mg"].iloc[i], df["% K"].iloc[i])
        for i, r in enumerate(raw_results)
    ]
    return jsonify({"count": len(results), "results": results})
