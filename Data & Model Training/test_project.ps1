$ErrorActionPreference = "Stop"

Write-Host "[1/4] Installing dependencies..." -ForegroundColor Cyan
python -m pip install -r requirements.txt

Write-Host "[2/4] Running training pipeline..." -ForegroundColor Cyan
python .\src\train.py

Write-Host "[3/4] Checking required output files..." -ForegroundColor Cyan
$requiredFiles = @(
    "data\\housing_raw.csv",
    "data\\housing_clean.csv",
    "model\\model.pkl",
    "model\\scaler.pkl",
    "model\\feature_order.json",
    "model\\training_metadata.json",
    "docs\\model_report.md",
    "docs\\preprocessing.md",
    "notebooks\\eda_and_training.ipynb"
)

$missing = @()
foreach ($f in $requiredFiles) {
    if (-not (Test-Path $f)) {
        $missing += $f
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Missing required files:" -ForegroundColor Red
    $missing | ForEach-Object { Write-Host " - $_" -ForegroundColor Red }
    exit 1
}

Write-Host "[4/4] Running inference smoke test..." -ForegroundColor Cyan
@'
import json
import joblib
import pandas as pd

model = joblib.load("model/model.pkl")
scaler = joblib.load("model/scaler.pkl")
with open("model/feature_order.json", "r", encoding="utf-8") as f:
    order = json.load(f)

df = pd.read_csv("data/housing_clean.csv")
X = df[order].head(5)
X_scaled = scaler.transform(X)
preds = model.predict(X_scaled)
print("Smoke test OK. Sample predictions:", [round(float(x), 2) for x in preds[:3]])
'@ | python -

Write-Host "All checks passed." -ForegroundColor Green
