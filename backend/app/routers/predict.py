import io

import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile

from ..constants import BATCH_INPUT_COLS
from ..model import ModelNotLoadedError, compute_percentages, get_model, predict_dataframe
from ..schemas import BatchPredictionResponse, PredictionResult, SoilSample

router = APIRouter(prefix="/predict", tags=["prediction"])


@router.post("", response_model=PredictionResult)
def predict_single(sample: SoilSample) -> PredictionResult:
    """Equivalent to the "Single Prediction" button in Main.py."""
    try:
        model = get_model()
    except ModelNotLoadedError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    df = pd.DataFrame(
        [[sample.P, sample.SAND, sample.CLAY, sample.N, sample.K, sample.Ca,
          sample.Mg, sample.Na, sample.CEC, sample.SAR, sample.ESP]],
        columns=["P", "SAND", "CLAY", "N", "K", "Ca", "Mg", "Na", "CEC", "SAR", "ESP"],
    )
    pct_ca, pct_mg, pct_k = compute_percentages(sample.Ca, sample.Mg, sample.K, sample.Na)
    df["% Ca"], df["% Mg"], df["% K"] = pct_ca, pct_mg, pct_k

    try:
        result = predict_dataframe(model, df)[0]
    except KeyError as exc :
        raise HTTPException(
            status_code=500,
            detail=f"Model expects a column the request didn't provide: {exc}",
        ) from exc
    except Exception as exc :
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc

    return PredictionResult(
        label=result["label"],
        class_index=result["class_index"],
        confidence=result["confidence"],
        percent_ca=pct_ca,
        percent_mg=pct_mg,
        percent_k=pct_k,
    )


@router.post("/batch", response_model=BatchPredictionResponse)
async def predict_batch(file: UploadFile = File(...)) -> BatchPredictionResponse:
    """Equivalent to the "Batch Prediction" CSV upload flow in Main.py."""
    if not (file.filename or "").lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a .csv file.")

    raw_bytes = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(raw_bytes))
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=400, detail=f"Could not read CSV: {exc}") from exc

    missing_cols = [c for c in BATCH_INPUT_COLS if c not in df.columns]
    if missing_cols:
        raise HTTPException(status_code=422, detail=f"Missing columns: {', '.join(missing_cols)}")

    non_numeric = [c for c in BATCH_INPUT_COLS if not pd.api.types.is_numeric_dtype(df[c])]
    if non_numeric:
        raise HTTPException(
            status_code=422,
            detail=f"Non-numeric values found in: {', '.join(non_numeric)}. "
                   f"Please ensure all columns contain numbers.",
        )

    rows_with_nan = df[BATCH_INPUT_COLS].isnull().any(axis=1)
    if rows_with_nan.any():
        bad_rows = list(rows_with_nan[rows_with_nan].index + 2)  # +2 = header row + 1-index
        raise HTTPException(
            status_code=422,
            detail=f"Missing values detected in rows: {bad_rows}. "
                   f"Please fill or remove incomplete rows before uploading.",
        )

    try:
        model = get_model()
    except ModelNotLoadedError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc

    pct = df.apply(lambda r: compute_percentages(r["Ca"], r["Mg"], r["K"], r["Na"]), axis=1, result_type="expand")
    df["% Ca"], df["% Mg"], df["% K"] = pct[0], pct[1], pct[2]

    try:
        raw_results = predict_dataframe(model, df)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Prediction error: {exc}") from exc

    results = [
        PredictionResult(
            label=r["label"],
            class_index=r["class_index"],
            confidence=r["confidence"],
            percent_ca=df["% Ca"].iloc[i],
            percent_mg=df["% Mg"].iloc[i],
            percent_k=df["% K"].iloc[i],
        )
        for i, r in enumerate(raw_results)
    ]
    return BatchPredictionResponse(count=len(results), results=results)
