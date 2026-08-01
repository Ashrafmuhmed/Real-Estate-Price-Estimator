# Real Estate Price Estimator

An end-to-end machine learning application that estimates residential property prices from basic property characteristics. Users enter the size, number of bedrooms and bathrooms, and age of a property, and a trained ML model returns an estimated market value.

The system is built as three cooperating services deployed to Kubernetes on AWS EKS:

```
Browser (React + Vite)
        │  /api/*
        ▼
Express API  ──────►  FastAPI Predictor  ──►  Trained Model (scikit-learn)
(frontend proxy)        (scikit-learn)            (RandomForest, saved as .pkl)
```

## Features

- **AI-powered estimation** — a trained regression model predicts property prices
- **Single & portfolio estimation** — estimate one property or up to 100 in a single batch
- **Fast results** — predictions returned in milliseconds
- **Modern UI** — React 19 + Tailwind CSS + Framer Motion
- **Reproducible ML pipeline** — cleaning, feature engineering, training, and evaluation
- **CI/CD** — automated tests, Docker builds, and deployment to AWS EKS

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion |
| Backend API | Node.js, Express, Joi validation |
| Prediction service | Python, FastAPI, scikit-learn, pandas |
| Model | Ames Housing dataset (OpenML), Gradient Boosting / Random Forest |
| Infrastructure | Docker, Kubernetes (EKS), Terraform, GitHub Actions, AWS |

## Repository Structure

```
├── backend/            # Express API (routes, controllers, services, schemas)
├── frontend/           # React + Vite web app
├── predictor/          # FastAPI service that serves the trained model
├── ml/                 # ML training pipeline (data, notebooks, model artifacts)
│   ├── data/           #   raw & cleaned datasets
│   ├── model/          #   saved model, scaler, feature order, metadata
│   ├── notebooks/      #   EDA and training notebooks
│   └── src/            #   cleaning, feature engineering, training code
├── infra/
│   ├── kube/           # Kubernetes manifests (deployments, services, ingress)
│   └── terraform/      # AWS VPC + EKS cluster provisioning
├── docs/               # Integration guides
└── .github/workflows/  # CI + CD pipelines
```

## Prerequisites

- Node.js 18+ (`.nvmrc` files pin the version for each app)
- Python 3.12+
- Docker (optional, for containerized runs)
- AWS CLI + Terraform (optional, for cloud deployment)

## Running Locally

Start the three services in three terminals.

### 1. Prediction service (port 8000)

Run from the repository root:

```bash
python -m venv predictor/.venv
source predictor/.venv/bin/activate
pip install -r predictor/requirements.txt
uvicorn predictor.app.main:app --host 0.0.0.0 --port 8000
```

### 2. Backend API (port 3001)

```bash
cd backend
npm install
npm run dev
```

The backend proxies prediction requests to the predictor service, which it expects at `PREDICTOR_SERVICE_URL` (default `http://127.0.0.1:8000`).

### 3. Frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). In development, Vite proxies `/api` requests to the backend (see `frontend/vite.config.js`), mirroring the production nginx configuration.

## API

### `POST /estimate` — estimate a single property

```bash
curl -X POST http://localhost:3001/estimate \
  -H "Content-Type: application/json" \
  -d '{"sqft": 1800, "bedrooms": 3, "bathrooms": 2, "age": 12}'
```

```json
{ "predicted_price": 279848.76 }
```

### `POST /portfolio` — estimate multiple properties

```bash
curl -X POST http://localhost:3001/portfolio \
  -H "Content-Type: application/json" \
  -d '{"records": [{"sqft": 1800, "bedrooms": 3, "bathrooms": 2, "age": 12}, {"sqft": 1200, "bedrooms": 2, "bathrooms": 1, "age": 25}]}'
```

```json
{
  "houses": [
    { "house": { "sqft": 1800, "bedrooms": 3, "bathrooms": 2, "age": 12 }, "predictedPrice": 279848.76 },
    { "house": { "sqft": 1200, "bedrooms": 2, "bathrooms": 1, "age": 25 }, "predictedPrice": 153570.50 }
  ],
  "totalPredictedPrice": 433419.26
}
```

Input fields: `sqft` (300–10000), `bedrooms` (1–10), `bathrooms` (0.5–10), `age` (0–150). Invalid records are rejected with `400`; a batch still estimates the valid records and marks invalid ones as failed.

### Prediction service endpoints

The FastAPI service exposes `GET /health`, `POST /predict`, and `POST /predict-batch` directly. See [docs/predictor_integration.md](docs/predictor_integration.md).

## Testing

```bash
# Backend (Jest + Supertest)
cd backend && npm test

# Frontend (Oxlint + build)
cd frontend && npm run lint && npm run build

# Predictor (pytest)
source predictor/.venv/bin/activate
cd predictor
PYTHONPATH=.. pytest tests -q
```

## ML Pipeline

The training pipeline lives in `ml/` and is fully reproducible:

```bash
cd ml
pip install -r requirements.txt
python src/train.py
```

It downloads the Ames Housing dataset from OpenML, cleans it (missing values, duplicates, domain rules, IQR outliers), engineers features (`sqft`, `bedrooms`, `bathrooms`, `age`), trains Linear Regression, Random Forest, and Gradient Boosting models, and saves the best one with its scaler and metadata to `ml/model/`. See [ml/docs/model_report.md](ml/docs/model_report.md).

## Deployment

### Docker

Each service has a Dockerfile:

```bash
docker build -f backend/Dockerfile -t backend-real-estate .
docker build -f frontend/Dockerfile -t frontend-real-estate .
docker build -f predictor/Dockerfile -t predictor-real-estate .
```

### Kubernetes

`infra/kube/` contains deployments, services, and an nginx ingress for the three services. Apply from the cluster:

```bash
kubectl apply -f infra/kube -n real-estate-prod
```

### Infrastructure

`infra/terraform/` provisions an AWS VPC and EKS cluster:

```bash
cd infra/terraform
terraform init
terraform plan
terraform apply
```

### CI/CD

- **CI** (`.github/workflows/ci.yml`): runs backend, frontend, and predictor tests on push/PR to `main`.
- **CD** (`.github/workflows/cd.yml`): on manual trigger, builds and pushes Docker images to Docker Hub, then deploys the manifests to AWS EKS.

## Documentation

- [Predictor integration guide](docs/predictor_integration.md)
- [Model report](ml/docs/model_report.md)
- [Preprocessing pipeline](ml/docs/preprocessing.md)

## License

Academic project. All rights reserved.
