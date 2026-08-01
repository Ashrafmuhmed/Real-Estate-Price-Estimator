from __future__ import annotations

from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from pydantic import BaseModel, Field

from .predictor import Predictor

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_MODEL_DIR = PROJECT_ROOT / "ml" / "model"


class Features(BaseModel):
    sqft: float = Field(..., ge=0)
    bedrooms: float = Field(..., ge=0)
    bathrooms: float = Field(..., ge=0)
    age: float = Field(..., ge=0)


class BatchRequest(BaseModel):
    records: list[Features] = Field(..., min_length=1)


class PredictResponse(BaseModel):
    price: float


class PredictBatchResponse(BaseModel):
    prices: list[float]


def create_app(model_dir: Path = DEFAULT_MODEL_DIR) -> FastAPI:
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        app.state.predictor = Predictor.from_model_dir(model_dir=model_dir)
        yield

    app = FastAPI(
        title="Real Estate Predictor Service",
        version="1.0.0",
        lifespan=lifespan,
    )

    def predictor_from_request(request: Request) -> Predictor:
        return request.app.state.predictor

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/predict", response_model=PredictResponse)
    def predict(payload: Features, request: Request) -> PredictResponse:
        predictor = predictor_from_request(request)
        price = predictor.predict_one(payload.model_dump())
        return PredictResponse(price=price)

    @app.post("/predict-batch", response_model=PredictBatchResponse)
    def predict_batch(payload: BatchRequest, request: Request) -> PredictBatchResponse:
        predictor = predictor_from_request(request)
        prices = predictor.predict_batch([row.model_dump() for row in payload.records])
        return PredictBatchResponse(prices=prices)

    return app


app = create_app()
