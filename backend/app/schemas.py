from typing import Optional

from pydantic import BaseModel, Field, model_validator


class SoilSample(BaseModel):
    """Single-sample request body — mirrors the Streamlit "Single Prediction"
    form fields exactly, including the same min/max ranges as Main.py."""

    SAND: float = Field(..., ge=0, le=100, description="Sand fraction, mass %")
    CLAY: float = Field(..., ge=0, le=100, description="Clay fraction, mass %")
    SILT: float = Field(..., ge=0, le=100, description="Silt fraction, mass %")
    N: float = Field(..., ge=0, le=2.1, description="Nitrogen, mass %")
    P: float = Field(..., ge=0, le=350, description="Phosphorus, mg/kg")
    Ca: float = Field(..., ge=0, le=50, description="Calcium, Cmol(+)/kg")
    K: float = Field(..., ge=0, le=10, description="Potassium, Cmol(+)/kg")
    Mg: float = Field(..., ge=0, le=20, description="Magnesium, Cmol(+)/kg")
    Na: float = Field(..., ge=0, le=15, description="Sodium, Cmol(+)/kg")
    CEC: float = Field(..., ge=0, le=60, description="Cation Exchange Capacity")
    SAR: float = Field(..., ge=0, le=26, description="Sodium Adsorption Ratio")
    ESP: float = Field(..., ge=0, le=100, description="Exchangeable Sodium Percentage")

    @model_validator(mode="after")
    def texture_must_sum_to_100(self) -> "SoilSample":
        total = self.SAND + self.CLAY + self.SILT
        if abs(total - 100.0) > 0.01:
            raise ValueError(
                f"Sand + Clay + Silt must sum to exactly 100% (got {total:.1f}%)."
            )
        return self


class PredictionResult(BaseModel):
    label: str
    class_index: int
    confidence: Optional[float] = None
    percent_ca: float
    percent_mg: float
    percent_k: float


class BatchPredictionResponse(BaseModel):
    count: int
    results: list[PredictionResult]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_error: Optional[str] = None
