import express from "express";
import cors from "cors";
import morgan from "morgan";
import config from "./config.js";
import estimateRouter from "./routes/estimate.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ service: "Real Estate Price Estimator API", version: "1.0.0" });
});

app.use("/estimate", estimateRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

if (process.argv[1] && process.argv[1].endsWith("app.js")) {
  app.listen(config.port, () => {
    console.log(`API listening on http://localhost:${config.port}`);
  });
}

export default app;
