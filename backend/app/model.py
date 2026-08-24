import joblib
import pandas as pd

from .config import settings
from .constants import PH_LABELS, REQUIRED_COLS

_model = None
_load_error: str | None = None


class ModelNotLoadedError(RuntimeError):
    pass

def _limit_parallelism(model) -> None:
    if hasattr(model, "n_jobs"):
        model.n_jobs = 1
    for estimator in getattr(model, "named_estimators_", {}).values():
        for step in getattr(estimator, "named_steps", {}).values():
            if hasattr(step, "n_jobs"):
                step.n_jobs = 1


def load_model() -> None:
    global _model, _load_error
    try:
        _model = joblib.load(settings.model_path)
        if settings.limit_parallelism:
            _limit_parallelism(_model)
        _load_error = None
    except Exception as exc:
        _model = None
        _load_error = f"{type(exc).__name__}: {exc}"


def is_model_loaded() -> bool:
    return _model is not None


def get_load_error() -> str | None:
    return _load_error


def get_model():
    if _model is None:
        raise ModelNotLoadedError(_load_error or "Model has not been loaded.")
    return _model


def compute_percentages(Ca: float, Mg: float, K: float, Na: float) -> tuple[float, float, float]:
    total = Ca + Mg + K + Na
    if total > 0:
        return (Ca / total) * 100, (Mg / total) * 100, (K / total) * 100
    return 0.0, 0.0, 0.0


def build_input_df(
    P: float, SAND: float, CLAY: float, N: float, K: float,
    Ca: float, Mg: float, Na: float, CEC: float, SAR: float, ESP: float,
) -> pd.DataFrame:
    pct_ca, pct_mg, pct_k = compute_percentages(Ca, Mg, K, Na)
    return pd.DataFrame(
        [[P, SAND, CLAY, N, K, Ca, Mg, Na, CEC, SAR, ESP, pct_ca, pct_mg, pct_k]],
        columns=REQUIRED_COLS,
    )


def predict_dataframe(model, df: pd.DataFrame) -> list[dict]:
    df = df.copy()
    for col in ("ESP", "% Ca", "% Mg", "% K"):
        if col in df.columns:
            df[col] = df[col] / 100.0

    aligned = df[model.feature_names_in_]
    raw_predictions = model.predict(aligned)

    probas = None
    if hasattr(model, "predict_proba"):
        try:
            probas = model.predict_proba(aligned)
        except Exception: 
            probas = None

    results = []
    for i, raw_value in enumerate(raw_predictions):
        class_index = max(0, min(4, round(float(raw_value))))
        label = PH_LABELS.get(class_index, "Unknown")

        confidence = None
        if probas is not None:
            try:
                confidence = float(probas[i][class_index]) * 100
            except Exception:
                confidence = None

        results.append(
            {
                "raw_value": float(raw_value),
                "class_index": class_index,
                "label": label,
                "confidence": confidence,
            }
        )
    return results
