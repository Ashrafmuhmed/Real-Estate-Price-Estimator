import { jest } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("../src/services/predictorService.js", () => ({
  estimatePrice: jest.fn(),
  estimatePortfolioPrice: jest.fn(),
}));

const { estimatePortfolioPrice } = await import("../src/services/predictorService.js");
const app = (await import("../src/app.js")).default;

describe("POST /portfolio", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when records is missing", async () => {
    const res = await request(app).post("/portfolio").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 when records is empty", async () => {
    const res = await request(app).post("/portfolio").send({ records: [] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("estimates the whole portfolio with a single batch call", async () => {
    estimatePortfolioPrice.mockResolvedValue([185000, 250000]);

    const res = await request(app)
      .post("/portfolio")
      .send({
        records: [
          { sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 },
          { sqft: 2200, bedrooms: 4, bathrooms: 3, age: 5 },
        ],
      });

    expect(res.status).toBe(200);
    expect(estimatePortfolioPrice).toHaveBeenCalledTimes(1);
    expect(estimatePortfolioPrice).toHaveBeenCalledWith([
      { sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 },
      { sqft: 2200, bedrooms: 4, bathrooms: 3, age: 5 },
    ]);
    expect(res.body.totalPredictedPrice).toBe(435000);
    expect(res.body.houses).toEqual([
      { house: { sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 }, predictedPrice: 185000 },
      { house: { sqft: 2200, bedrooms: 4, bathrooms: 3, age: 5 }, predictedPrice: 250000 },
    ]);
  });

  it("batches only valid houses and marks invalid ones as failed", async () => {
    estimatePortfolioPrice.mockResolvedValue([185000]);

    const res = await request(app)
      .post("/portfolio")
      .send({
        records: [
          { sqft: -100, bedrooms: 3, bathrooms: 2, age: 12 },
          { sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 },
        ],
      });

    expect(res.status).toBe(200);
    expect(estimatePortfolioPrice).toHaveBeenCalledTimes(1);
    expect(estimatePortfolioPrice).toHaveBeenCalledWith([
      { sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 },
    ]);
    expect(res.body.houses[0].status).toBe("failed");
    expect(res.body.houses[1]).toEqual({
      house: { sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 },
      predictedPrice: 185000,
    });
    expect(res.body.totalPredictedPrice).toBe(185000);
  });

  it("marks valid houses as failed when the predictor service is unreachable", async () => {
    const networkError = new Error("connect ECONNREFUSED");
    networkError.code = "ECONNREFUSED";
    estimatePortfolioPrice.mockRejectedValue(networkError);

    const res = await request(app)
      .post("/portfolio")
      .send({
        records: [
          { sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 },
          { sqft: 2200, bedrooms: 4, bathrooms: 3, age: 5 },
        ],
      });

    expect(res.status).toBe(200);
    expect(estimatePortfolioPrice).toHaveBeenCalledTimes(1);
    expect(res.body.houses.every((house) => house.status === "failed")).toBe(true);
    expect(res.body.houses[0].error).toBe("Predictor service unavailable");
    expect(res.body.totalPredictedPrice).toBe(0);
  });
});
