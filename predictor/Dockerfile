FROM python:3.12-slim

WORKDIR /app

COPY ["predictor", "predictor"]
COPY ["ml/model", "ml/model"]

RUN pip install --no-cache-dir -r predictor/requirements.txt

EXPOSE 8000

CMD ["uvicorn", "predictor.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
