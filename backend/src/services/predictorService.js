import axios from "axios";
import config from "../config.js";

const client = axios.create({
  baseURL: config.predictorServiceUrl,
  timeout: 5000,
});

export async function estimatePrice(features) {
  const { data } = await client.post("/predict", features);
  return data.price;
}


export async function estimatePortfolioPrice(featureList) {
  const { data } = await client.post("/predict-batch", { records: featureList });
  return data.prices;
}