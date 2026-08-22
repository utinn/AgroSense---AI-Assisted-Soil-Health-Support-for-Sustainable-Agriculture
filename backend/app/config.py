import os

from dotenv import load_dotenv

load_dotenv() 


def _split_csv_env(name: str, default: str) -> list[str]:
    raw = os.getenv(name, default)
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


class Settings:
    model_path: str = os.getenv(
        "MODEL_PATH",
        os.path.join(os.path.dirname(__file__), "..", "models", "soil_ph_model.pkl"),
    )

    cors_origins: list[str] = _split_csv_env(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )


settings = Settings()
