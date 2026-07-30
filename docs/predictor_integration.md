# Predictor Service Integration Guide (Node API)

This service wraps the trained Python model behind HTTP and is intended to be called by the Node API.

## Service location

- App entrypoint: `predictor_service/app/main.py`
- Model adapter: `predictor_service/app/predictor.py`
- Default model artifacts dir: `Data & Model Training/model/`

## Run locally

From repository root:

```bash
python -m pip install fastapi "uvicorn[standard]" pandas numpy joblib scikit-learn
uvicorn predictor_service.app.main:app --host 0.0.0.0 --port 8001
```

Health check:

```bash
curl http://localhost:8001/health
```

## Endpoints

### `POST /predict`

Request body:

```json
{
  "sqft": 1800,
  "bedrooms": 3,
  "bathrooms": 2,
  "age": 12
}
```

Response body:

```json
{
  "price": 245331.72
}
```

### `POST /predict-batch`

Request body:

```json
{
  "records": [
    { "sqft": 1800, "bedrooms": 3, "bathrooms": 2, "age": 12 },
    { "sqft": 1200, "bedrooms": 2, "bathrooms": 1, "age": 25 }
  ]
}
```

Response body:

```json
{
  "prices": [245331.72, 168820.13]
}
```

## Node integration pattern

Use a single base URL from env and call via `fetch`/`axios`.

```ts
const predictorBaseUrl = process.env.PREDICTOR_URL ?? "http://localhost:8001";

export async function predictPrice(payload: {
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  age: number;
}) {
  const response = await fetch(`${predictorBaseUrl}/predict`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Predictor failed: ${response.status}`);
  }
  return (await response.json()) as { price: number };
}
```

## Notes

- Prices are clipped to non-negative values.
- Model/scaler artifacts are loaded once when the FastAPI app is created, not on each request.
