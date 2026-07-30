import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { estimateHouse } from "../secrvices/api";

export default function Portfolio() {
  const [properties, setProperties] = useState([
    {
      sqft: "",
      bedrooms: "",
      bathrooms: "",
      age: "",
    },
  ]);

  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);

  function handleChange(index, e) {
    const updated = [...properties];
    updated[index][e.target.name] = e.target.value;
    setProperties(updated);
  }

  function addProperty() {
    setProperties([
      ...properties,
      {
        sqft: "",
        bedrooms: "",
        bathrooms: "",
        age: "",
      },
    ]);
  }

  function removeProperty(index) {
    const updated = properties.filter((_, i) => i !== index);
    setProperties(updated);
  }

  async function estimatePortfolio() {
    // ============================
    // BACKEND GOES HERE LATER
    //
    // const response = await fetch("/portfolio");
    //
    // ============================
    const hasEmpty = properties.some(
      (property) =>
        !property.sqft ||
        !property.bedrooms ||
        !property.bathrooms ||
        !property.age,
    );

    if (hasEmpty) {
      alert("Please complete every property.");
      return;
    }
    try {
      const result = await estimatePortfolio(properties);

      setResults(result.predictions);

      setTotal(result.total);

      setAverage(result.average);
    } catch (error) {
      alert("Portfolio prediction failed.");
    }

    const result = await estimatePortfolio(properties);

    setResults(result.predictions);

    const totalValue = result.predictions.reduce(
      (sum, value) => sum + value,
      0,
    );

    setTotal(totalValue);

    setAverage(Math.round(totalValue / result.predictions.length));
  }

  const chartData = results.map((price, index) => ({
    name: `House ${index + 1}`,
    price,
  }));

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-black mb-12">Portfolio Estimator</h1>

      <div className="space-y-8">
        {properties.map((property, index) => (
          <div
            key={index}
            className="rounded-2xl bg-slate-900 border border-white/10 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Property #{index + 1}</h2>

              {properties.length > 1 && (
                <button
                  onClick={() => removeProperty(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="number"
                name="sqft"
                placeholder="Square Feet"
                value={property.sqft}
                onChange={(e) => handleChange(index, e)}
                className="bg-slate-800 rounded-xl p-4"
              />

              <input
                type="number"
                name="bedrooms"
                placeholder="Bedrooms"
                value={property.bedrooms}
                onChange={(e) => handleChange(index, e)}
                className="bg-slate-800 rounded-xl p-4"
              />

              <input
                type="number"
                name="bathrooms"
                placeholder="Bathrooms"
                value={property.bathrooms}
                onChange={(e) => handleChange(index, e)}
                className="bg-slate-800 rounded-xl p-4"
              />

              <input
                type="number"
                name="age"
                placeholder="House Age"
                value={property.age}
                onChange={(e) => handleChange(index, e)}
                className="bg-slate-800 rounded-xl p-4"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <button
          onClick={addProperty}
          className="bg-cyan-500 px-6 py-3 rounded-xl font-bold hover:bg-cyan-400 transition"
        >
          + Add Property
        </button>

        <button
          onClick={estimatePortfolio}
          className="bg-green-500 px-6 py-3 rounded-xl font-bold hover:bg-green-400 transition"
        >
          Estimate Portfolio
        </button>
      </div>

      {results.length > 0 && (
        <>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
              <p className="text-slate-400">Total Portfolio Value</p>

              <h2 className="text-3xl font-bold text-cyan-400 mt-3">
                ${total.toLocaleString()}
              </h2>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
              <p className="text-slate-400">Average Property</p>

              <h2 className="text-3xl font-bold text-green-400 mt-3">
                ${average.toLocaleString()}
              </h2>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
              <p className="text-slate-400">Number of Properties</p>

              <h2 className="text-3xl font-bold text-yellow-400 mt-3">
                {properties.length}
              </h2>
            </div>
          </div>

          <div className="mt-12 bg-slate-900 rounded-2xl border border-white/10 p-8">
            <h2 className="text-3xl font-bold mb-8">Portfolio Chart</h2>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="#06b6d4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
}
