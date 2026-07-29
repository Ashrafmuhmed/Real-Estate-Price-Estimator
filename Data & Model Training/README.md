# Real Estate Price Estimator API - ML Pipeline

This repository contains a reproducible machine learning pipeline for residential price prediction using:

- sqft
- bedrooms
- bathrooms
- age

## Run

```powershell
pip install -r requirements.txt
python .\src\train.py
```

## Outputs

- `data/housing_raw.csv`
- `data/housing_clean.csv`
- `model/model.pkl`
- `model/scaler.pkl`
- `model/feature_order.json`
- `model/training_metadata.json`
- `docs/preprocessing.md`
- `docs/model_report.md`
- `notebooks/eda_and_training.ipynb`
