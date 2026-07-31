FROM python:3.12-slim

WORKDIR /app

COPY ["predictor_service", "predictor_service"]
COPY ["Data & Model Training/model", "Data & Model Training/model"]

RUN pip install --no-cache-dir \
    fastapi \
    "uvicorn[standard]" \
    joblib \
    numpy \
    pandas \
    scikit-learn

EXPOSE 8000

CMD ["uvicorn", "predictor_service.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
