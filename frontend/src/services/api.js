const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export async function estimateHouse(data) {
  const response = await fetch(`${BASE_URL}/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sqft: Number(data.sqft),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      age: Number(data.age),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Prediction failed");
  }

  return result;
}

// Portfolio estimation
export async function estimatePortfolio(records) {
  const response = await fetch(`${BASE_URL}/portfolio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: records.map((house) => ({
        sqft: Number(house.sqft),
        bedrooms: Number(house.bedrooms),
        bathrooms: Number(house.bathrooms),
        age: Number(house.age),
      })),
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Portfolio estimation failed");
  }

  return result;
}
