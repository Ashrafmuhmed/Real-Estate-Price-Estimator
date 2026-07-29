# Preprocessing Pipeline

## Selected dataset
- Source: Ames Housing dataset (OpenML `house_prices`)
- Final columns: `sqft, bedrooms, bathrooms, age, price`

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
{
  "initial_rows": 1460,
  "rows_after_missing_drop": 1460,
  "rows_after_duplicate_drop": 1459,
  "rows_after_domain_filters": 1450,
  "rows_after_iqr_filter": 1348,
  "dropped_missing": 0,
  "dropped_duplicates": 1,
  "dropped_domain": 9,
  "dropped_iqr": 102,
  "iqr_bounds": {
    "sqft": [
      160.125,
      2749.125
    ],
    "bedrooms": [
      0.5,
      4.5
    ],
    "bathrooms": [
      -1.25,
      4.75
    ],
    "age": [
      -43.0,
      141.0
    ],
    "price": [
      4000.0,
      340000.0
    ]
  }
}
```

## Feature engineering
```json
{
  "feature_order": [
    "sqft",
    "bedrooms",
    "bathrooms",
    "age"
  ],
  "target_name": "price",
  "price_skew": 0.6891247629620073,
  "used_log_price": false
}
```

## Train/test split and scaling
```json
{
  "test_size": 0.2,
  "random_state": 42,
  "scaler": "StandardScaler",
  "train_rows": 1078,
  "test_rows": 270
}
```
