export default function errorHandler(err, _req, res, _next) {
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  if (err.code === "ECONNREFUSED" || err.code === "ECONNABORTED") {
    return res.status(502).json({
      error: "Predictor service unavailable",
    });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
}
