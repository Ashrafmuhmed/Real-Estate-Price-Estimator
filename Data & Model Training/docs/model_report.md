# Model Report

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
- Feature order: `['sqft', 'bedrooms', 'bathrooms', 'age']`
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
| LinearRegression | 31999.80 | 24653.74 | 0.7056 |
| RandomForestRegressor **(Best)** | 28744.62 | 20968.35 | 0.7624 |
| GradientBoostingRegressor | 29000.10 | 21264.64 | 0.7582 |

## Selected best model
- `RandomForestRegressor`
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
