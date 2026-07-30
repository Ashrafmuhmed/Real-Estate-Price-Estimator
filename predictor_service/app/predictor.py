from __future__ import annotations

import json
from pathlib import Path
from typing import Iterable

import joblib
import numpy as np
import pandas as pd


class Predictor:
    def __init__(self, model_dir: Path) -> None:
        self.model_dir = model_dir
        self._load_artifacts()

    @classmethod
    def from_model_dir(cls, model_dir: Path) -> "Predictor":
        return cls(model_dir=model_dir)

    def _load_artifacts(self) -> None:
        self.model = joblib.load(self.model_dir / "model.pkl")
        self.scaler = joblib.load(self.model_dir / "scaler.pkl")
        self.feature_order = json.loads(
            (self.model_dir / "feature_order.json").read_text(encoding="utf-8")
        )
        metadata = json.loads(
            (self.model_dir / "training_metadata.json").read_text(encoding="utf-8")
        )
        self.use_log_price = bool(
            metadata.get("feature_engineering_summary", {}).get("used_log_price", False)
        )

    def _to_frame(self, payload: Iterable[dict[str, float]]) -> pd.DataFrame:
        rows = list(payload)
        frame = pd.DataFrame(rows)
        return frame[self.feature_order]

    def _predict(self, payload: Iterable[dict[str, float]]) -> np.ndarray:
        frame = self._to_frame(payload)
        scaled = self.scaler.transform(frame)
        predictions = np.asarray(self.model.predict(scaled), dtype=float)
        if self.use_log_price:
            predictions = np.expm1(predictions)
        return np.maximum(predictions, 0.0)

    def predict_one(self, payload: dict[str, float]) -> float:
        return float(self._predict([payload])[0])

    def predict_batch(self, payload: list[dict[str, float]]) -> list[float]:
        return self._predict(payload).tolist()
