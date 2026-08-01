from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from cleaning import build_raw_housing_frame, clean_housing_frame
from feature_engineering import build_features
from preprocessing import split_and_scale
from utils import FEATURE_ORDER, current_year, project_root, save_json


def _evaluate_predictions(y_true: np.ndarray, y_pred: np.ndarray) -> dict[str, float]:
    return {
        "rmse": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "r2": float(r2_score(y_true, y_pred)),
    }


def _metrics_markdown(metrics: dict[str, dict[str, float]], best_model: str) -> str:
    rows = []
    for model_name, scores in metrics.items():
        marker = " **(Best)**" if model_name == best_model else ""
        rows.append(
            f"| {model_name}{marker} | {scores['rmse']:.2f} | {scores['mae']:.2f} | {scores['r2']:.4f} |"
        )
    return "\n".join(rows)


def _write_docs(
    root: Path,
    cleaning_summary: dict[str, Any],
    fe_summary: dict[str, Any],
    prep_summary: dict[str, Any],
    metrics: dict[str, dict[str, float]],
    best_model_name: str,
) -> None:
    docs_dir = root / "docs"
    docs_dir.mkdir(parents=True, exist_ok=True)

    preprocessing_doc = f"""# Preprocessing Pipeline

## Selected dataset
- Source: Ames Housing dataset (OpenML `house_prices`)
- Final columns: `{", ".join(FEATURE_ORDER + ["price"])}`

## Cleaning decisions
- Missing values: rows dropped for required columns only.
- Duplicates: full duplicates across model columns removed.
- Domain rules:
  - sqft in [300, 10000]
  - bedrooms in [1, 10]
  - bathrooms in [0.5, 10]
  - age in [0, 150]
  - price in [10000, 2000000]
- Outliers removed via IQR method for all numerical columns.

## Cleaning summary
```json
{json.dumps(cleaning_summary, indent=2)}
```

## Feature engineering
```json
{json.dumps(fe_summary, indent=2)}
```

## Train/test split and scaling
```json
{json.dumps(prep_summary, indent=2)}
```
"""
    (docs_dir / "preprocessing.md").write_text(preprocessing_doc, encoding="utf-8")

    model_report = f"""# Model Report

## Dataset description
- Dataset: Ames Housing
- Problem type: Regression
- Target: `price` (or `log(price)` when skewed)

## Data cleaning steps
- Removed missing rows, duplicates, unrealistic domain values, and IQR outliers.

## EDA summary
- Core features show expected real-estate behavior: larger area and more bathrooms tend to increase price.
- Bedrooms are weaker than sqft when area is already known.
- Age generally has a negative relationship with price.

## Feature engineering decisions
- Feature order: `{FEATURE_ORDER}`
- Price skew handled automatically with optional `log1p`.

## Train/Test split methodology
- `train_test_split(test_size=0.20, random_state=42)`
- StandardScaler fit on train set and reused for test/inference.

## Models trained
1. Linear Regression
2. Random Forest Regressor
3. Gradient Boosting Regressor

## Evaluation metrics (test set)
| Model | RMSE | MAE | R2 |
|---|---:|---:|---:|
{_metrics_markdown(metrics, best_model_name)}

## Selected best model
- `{best_model_name}`
- Selection criterion: minimum RMSE with strong MAE and R2.

## Final feature order
1. sqft
2. bedrooms
3. bathrooms
4. age

## Inference preprocessing requirements
1. Accept features in the exact order above.
2. Apply the persisted `scaler.pkl`.
3. If `used_log_price=true`, apply `expm1` to model output to recover price scale.

## Future improvements
- Hyperparameter optimization
- Feature interactions (location quality proxies, renovation flags)
- Uncertainty estimation for prediction intervals
"""
    (docs_dir / "model_report.md").write_text(model_report, encoding="utf-8")


def main() -> None:
    root = project_root()
    data_dir = root / "data"
    model_dir = root / "model"
    data_dir.mkdir(parents=True, exist_ok=True)
    model_dir.mkdir(parents=True, exist_ok=True)

    year = current_year()
    raw = build_raw_housing_frame(current_year=year)
    raw.to_csv(data_dir / "housing_raw.csv", index=False)

    clean, cleaning_summary = clean_housing_frame(raw)
    clean.to_csv(data_dir / "housing_clean.csv", index=False)

    x, y, fe_summary = build_features(clean)
    x_train, x_test, y_train, y_test, scaler, prep_summary = split_and_scale(x, y)

    models = {
        "LinearRegression": LinearRegression(),
        "RandomForestRegressor": RandomForestRegressor(
            n_estimators=400,
            random_state=42,
            n_jobs=-1,
        ),
        "GradientBoostingRegressor": GradientBoostingRegressor(random_state=42),
    }

    metrics: dict[str, dict[str, float]] = {}
    fitted_models: dict[str, Any] = {}
    used_log = bool(fe_summary.used_log_price)

    x_train_values = x_train.to_numpy()
    x_test_values = x_test.to_numpy()

    for name, model in models.items():
        model.fit(x_train_values, y_train)
        pred = model.predict(x_test_values)

        if used_log:
            y_eval = np.expm1(y_test.to_numpy())
            pred_eval = np.expm1(pred)
        else:
            y_eval = y_test.to_numpy()
            pred_eval = pred

        metrics[name] = _evaluate_predictions(y_eval, pred_eval)
        fitted_models[name] = model

    best_model_name = min(metrics, key=lambda k: metrics[k]["rmse"])
    best_model = fitted_models[best_model_name]

    joblib.dump(best_model, model_dir / "model.pkl")
    joblib.dump(scaler, model_dir / "scaler.pkl")
    save_json(model_dir / "feature_order.json", FEATURE_ORDER)

    metadata = {
        "best_model": best_model_name,
        "metrics": metrics,
        "cleaning_summary": cleaning_summary.to_dict(),
        "feature_engineering_summary": fe_summary.to_dict(),
        "preprocessing_summary": prep_summary.to_dict(),
    }
    save_json(model_dir / "training_metadata.json", metadata)

    _write_docs(
        root=root,
        cleaning_summary=cleaning_summary.to_dict(),
        fe_summary=fe_summary.to_dict(),
        prep_summary=prep_summary.to_dict(),
        metrics=metrics,
        best_model_name=best_model_name,
    )

    print(json.dumps(metadata, indent=2))


if __name__ == "__main__":
    main()
