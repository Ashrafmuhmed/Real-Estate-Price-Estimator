import { estimatePortfolioPrice } from '../services/predictorService.js';
import { estimateSingleSchema } from '../schemas/house.js';

export async function estimatePortfolio(req, res, next) {
  try {
    const { records } = req.validatedBody;

    const houses = [];
    const batch = [];

    for (const house of records) {
      const { error, value } = estimateSingleSchema.validate(house);

      if (error) {
        houses.push({ house, status: 'failed', error: error.details[0].message });
        continue;
      }

      houses.push(null);
      batch.push(value);
    }

    if (batch.length > 0) {
      try {
        const prices = await estimatePortfolioPrice(batch);

        let priceIndex = 0;
        for (let i = 0; i < houses.length; i++) {
          if (houses[i] === null) {
            houses[i] = { house: batch[priceIndex], predictedPrice: prices[priceIndex] };
            priceIndex++;
          }
        }
      } catch {
        let valueIndex = 0;
        for (let i = 0; i < houses.length; i++) {
          if (houses[i] === null) {
            houses[i] = {
              house: batch[valueIndex],
              status: 'failed',
              error: 'Predictor service unavailable',
            };
            valueIndex++;
          }
        }
      }
    }

    const totalPredictedPrice = houses.reduce(
      (sum, item) => sum + (item.predictedPrice ?? 0),
      0,
    );

    res.json({ houses, totalPredictedPrice });
  } catch (error) {
    next(error);
  }
}
