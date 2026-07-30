const BASE_URL = "http://127.0.0.1:8000";

// ------------------------------------
// Estimate one property
// ------------------------------------

export async function estimateHouse(data) {
  const response = await fetch(`${BASE_URL}/estimate`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  return await response.json();
}

// ------------------------------------
// Estimate portfolio
// ------------------------------------

export async function estimatePortfolio(data) {
  const response = await fetch(`${BASE_URL}/portfolio`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Prediction failed");
  }

  return await response.json();
}
