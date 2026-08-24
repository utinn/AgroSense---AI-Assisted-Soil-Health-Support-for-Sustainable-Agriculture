from fastapi import APIRouter

from ..model import get_load_error, is_model_loaded
from ..schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        model_loaded=is_model_loaded(),
        model_error=get_load_error(),
    )
