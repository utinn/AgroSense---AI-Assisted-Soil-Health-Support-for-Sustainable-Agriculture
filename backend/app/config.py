"""
Environment-driven settings. Nothing here is hardcoded so the same code runs
locally, on Render, or anywhere else — only the .env / environment variables
change between environments.
"""
import os

from dotenv import load_dotenv

load_dotenv()  # reads a local .env file if present; no-op on Render (uses dashboard env vars instead)


def _split_csv_env(name: str, default: str) -> list[str]:
    raw = os.getenv(name, default)
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


class Settings:
    # Where the .pkl model lives. Override with MODEL_PATH if you keep it
    # somewhere else (e.g. a mounted disk on Render).
    model_path: str = os.getenv(
        "MODEL_PATH",
        os.path.join(os.path.dirname(__file__), "..", "models", "soil_ph_model.pkl"),
    )

    # Comma-separated list of allowed frontend origins for CORS.
    # Set this to your real Vercel URL(s) in production.
    cors_origins: list[str] = _split_csv_env(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    )


settings = Settings()
