import { estimatePrice } from "../services/predictorService.js";

export async function estimate(req, res, next) {
  try {
    const price = await estimatePrice(req.validatedBody);

    res.json({ predicted_price: price });
  } catch (err) {
    next(err);
  }
}
