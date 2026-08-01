import "dotenv/config";

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  predictorServiceUrl: process.env.PREDICTOR_SERVICE_URL || "http://127.0.0.1:8000",
  nodeEnv: process.env.NODE_ENV || "development",
};

export default config;
