import os

from dotenv import load_dotenv

load_dotenv() 


def _split_csv_env(name: str, default: str) -> list[str]:
    raw = os.getenv(name, default)
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


def _bool_env(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in ("1", "true", "yes", "on")


class Settings:
    model_path: str = os.getenv(
        "MODEL_PATH",
        os.path.join(os.path.dirname(__file__), "..", "models", "soil_ph_model.pkl"),
    )

    cors_origins: list[str] = _split_csv_env(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )

    # Off by default so local/Docker FastAPI keeps the model's original
    # n_jobs=-1 parallelism. AnyMHost's passenger_wsgi.py sets this to "true"
    # since shared hosting can't tolerate the process pools that implies.
    limit_parallelism: bool = _bool_env("AGROSENSE_LIMIT_PARALLELISM", False)


settings = Settings()
