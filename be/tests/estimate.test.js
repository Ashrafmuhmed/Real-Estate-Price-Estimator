import { jest } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("../src/services/predictorService.js", () => ({
  estimatePrice: jest.fn(),
}));

const { estimatePrice } = await import("../src/services/predictorService.js");
const app = (await import("../src/app.js")).default;

describe("POST /estimate", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with predicted price for valid input", async () => {
    estimatePrice.mockResolvedValue(185000);

    const res = await request(app)
      .post("/estimate")
      .send({ sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ predicted_price: 185000 });
  });

  it("returns 400 when fields are missing", async () => {
    const res = await request(app)
      .post("/estimate")
      .send({ sqft: 1800 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 when sqft is negative", async () => {
    const res = await request(app)
      .post("/estimate")
      .send({ sqft: -100, bedrooms: 3, bathrooms: 2, age: 12 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 when bedrooms exceeds maximum", async () => {
    const res = await request(app)
      .post("/estimate")
      .send({ sqft: 1800, bedrooms: 15, bathrooms: 2, age: 12 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 400 when age is negative", async () => {
    const res = await request(app)
      .post("/estimate")
      .send({ sqft: 1800, bedrooms: 3, bathrooms: 2, age: -5 });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("returns 502 when predictor service is unreachable", async () => {
    const networkError = new Error("connect ECONNREFUSED");
    networkError.code = "ECONNREFUSED";
    estimatePrice.mockRejectedValue(networkError);

    const res = await request(app)
      .post("/estimate")
      .send({ sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 });

    expect(res.status).toBe(502);
    expect(res.body.error).toBe("Predictor service unavailable");
  });

  it("returns 500 for unexpected errors", async () => {
    estimatePrice.mockRejectedValue(new Error("Something broke"));

    const res = await request(app)
      .post("/estimate")
      .send({ sqft: 1800, bedrooms: 3, bathrooms: 2, age: 12 });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Internal server error");
  });
});
