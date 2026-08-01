from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

import joblib
import numpy as np
from fastapi.testclient import TestClient

from predictor.app.main import create_app
from predictor.app.predictor import Predictor


class DummyScaler:
    def transform(self, rows):
        return np.asarray(rows)


class DummyModel:
    def predict(self, rows):
        rows = np.asarray(rows, dtype=float)
        return rows[:, 0] - 2000.0


class PredictorServiceTests(unittest.TestCase):
    def _make_artifacts(self) -> Path:
        model_dir = Path(tempfile.mkdtemp())
        joblib.dump(DummyModel(), model_dir / "model.pkl")
        joblib.dump(DummyScaler(), model_dir / "scaler.pkl")
        (model_dir / "feature_order.json").write_text(
            json.dumps(["sqft", "bedrooms", "bathrooms", "age"]),
            encoding="utf-8",
        )
        (model_dir / "training_metadata.json").write_text(
            json.dumps({"feature_engineering_summary": {"used_log_price": False}}),
            encoding="utf-8",
        )
        return model_dir

    def test_predict_returns_non_negative_price(self):
        predictor = Predictor.from_model_dir(self._make_artifacts())
        result = predictor.predict_one(
            {"sqft": 1000, "bedrooms": 2, "bathrooms": 1, "age": 12}
        )
        self.assertGreaterEqual(result, 0.0)

    def test_predict_batch_returns_non_negative_prices(self):
        predictor = Predictor.from_model_dir(self._make_artifacts())
        results = predictor.predict_batch(
            [
                {"sqft": 1000, "bedrooms": 2, "bathrooms": 1, "age": 12},
                {"sqft": 2600, "bedrooms": 4, "bathrooms": 3, "age": 6},
            ]
        )
        self.assertEqual(len(results), 2)
        self.assertTrue(all(price >= 0.0 for price in results))

    @patch("predictor.app.main.Predictor.from_model_dir")
    def test_app_loads_predictor_once(self, from_model_dir):
        fake_predictor = Mock()
        fake_predictor.predict_one.return_value = 120000.0
        fake_predictor.predict_batch.return_value = [120000.0, 180000.0]
        from_model_dir.return_value = fake_predictor

        app = create_app(model_dir=Path("/tmp/fake-model-dir"))
        with TestClient(app) as client:
            first = client.post(
                "/predict",
                json={"sqft": 1200, "bedrooms": 2, "bathrooms": 1, "age": 20},
            )
            second = client.post(
                "/predict",
                json={"sqft": 1400, "bedrooms": 3, "bathrooms": 2, "age": 10},
            )
            batch = client.post(
                "/predict-batch",
                json={
                    "records": [
                        {"sqft": 1200, "bedrooms": 2, "bathrooms": 1, "age": 20},
                        {"sqft": 1400, "bedrooms": 3, "bathrooms": 2, "age": 10},
                    ]
                },
            )

        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(batch.status_code, 200)
        from_model_dir.assert_called_once_with(model_dir=Path("/tmp/fake-model-dir"))


if __name__ == "__main__":
    unittest.main()
