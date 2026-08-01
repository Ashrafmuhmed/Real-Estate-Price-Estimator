# Real Estate Price Estimator - ML Pipeline

This repository contains a reproducible machine learning pipeline for estimating residential property prices from structured housing features. The project downloads the Ames Housing dataset from OpenML, cleans and prepares the data, trains several regression models, and saves the best-performing model along with supporting artifacts.

## What this project does

- Builds a raw housing dataset from the OpenML `house_prices` source.
- Cleans the data by removing missing values, duplicates, unrealistic domain values, and outliers.
- Engineers a compact feature set:
  - `sqft`
  - `bedrooms`
  - `bathrooms`
  - `age`
- Trains and evaluates multiple regression models:
  - Linear Regression
  - Random Forest Regressor
  - Gradient Boosting Regressor
- Saves the selected model, preprocessing artifacts, and documentation for reuse.

## Project structure

- `src/` - training and preprocessing code
  - `cleaning.py` - raw data construction and cleaning logic
  - `feature_engineering.py` - feature matrix and target preparation
  - `preprocessing.py` - train/test split and scaling
  - `train.py` - end-to-end training pipeline
  - `utils.py` - shared helpers
- `data/` - generated raw and cleaned datasets
- `model/` - trained model, scaler, feature order, and training metadata
- `docs/` - preprocessing summary and model report
- `notebooks/` - exploratory analysis and training notebook
- `requirements.txt` - Python dependencies
- `test_project.ps1` - end-to-end validation script

## Requirements

- Python 3.10+
- pip

Install dependencies from the repository root:

```powershell
python -m pip install -r requirements.txt
```

## Training the model

Run the full pipeline:

```powershell
python .\src\train.py
```

This will generate the following outputs:

- `data/housing_raw.csv`
- `data/housing_clean.csv`
- `model/model.pkl`
- `model/scaler.pkl`
- `model/feature_order.json`
- `model/training_metadata.json`
- `docs/preprocessing.md`
- `docs/model_report.md`
- `notebooks/eda_and_training.ipynb`

## Validation

A PowerShell validation script is included to install dependencies, run training, verify output files, and perform a small inference smoke test:

```powershell
./test_project.ps1
```

## Notes on the pipeline

- The model input order is fixed as: `sqft`, `bedrooms`, `bathrooms`, `age`.
- Target preprocessing uses `log1p` when the target distribution is sufficiently skewed.
- Feature scaling is performed with `StandardScaler` fitted on the training split only.
- The best model is selected based on the lowest RMSE on the test set.

## Example inference

```python
import json
import joblib
import pandas as pd

model = joblib.load("model/model.pkl")
scaler = joblib.load("model/scaler.pkl")
with open("model/feature_order.json", "r", encoding="utf-8") as f:
    feature_order = json.load(f)

sample = pd.DataFrame([[1800, 3, 2, 12]], columns=feature_order)
sample_scaled = scaler.transform(sample)
prediction = model.predict(sample_scaled)
print(prediction)
```

If the training run used a log-transformed target, apply `numpy.expm1` to recover the original price scale before presenting predictions.

## Dataset source

This project uses the Ames Housing dataset made available through OpenML. Please review the upstream dataset source and licensing terms before redistribution or commercial use.
