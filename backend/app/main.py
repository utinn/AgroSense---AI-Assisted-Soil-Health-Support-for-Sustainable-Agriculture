from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .model import load_model
from .routers import health, predict


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs once when the server starts — load the .pkl into memory so every
    # request reuses it instead of re-reading the file from disk.
    load_model()
    yield
    # (nothing to clean up on shutdown)


app = FastAPI(
    title="AgroSense API",
    description="Soil pH classification API backing the AgroSense frontend.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(predict.router)


@app.get("/")
def root():
    return {"service": "AgroSense API", "docs": "/docs"}
