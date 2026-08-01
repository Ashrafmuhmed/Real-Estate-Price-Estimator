import { useState } from "react";
import { estimatePortfolio } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
const emptyHouse = {
  sqft: "",
  bedrooms: "",
  bathrooms: "",
  age: "",
};

export default function Portfolio() {
  const [houses, setHouses] = useState([{ ...emptyHouse }]);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(index, e) {
    setError("");
    const updatedHouses = [...houses];

    updatedHouses[index] = {
      ...updatedHouses[index],
      [e.target.name]: e.target.value,
    };

    setHouses(updatedHouses);
  }

  function addHouse() {
    if (houses.length >= 100) {
      setError("You can estimate up to 100 properties.");
      return;
    }

    setHouses([...houses, { ...emptyHouse }]);
  }

  function removeHouse(index) {
    if (houses.length === 1) {
      return;
    }

    setHouses(houses.filter((_, houseIndex) => houseIndex !== index));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const incomplete = houses.some(
      (house) =>
        !house.sqft || !house.bedrooms || !house.bathrooms || house.age === "",
    );

    if (incomplete) {
      setError("Please complete all property fields.");
      return;
    }

    try {
      setError("");
      setLoading(true);
      setResults(null);

      const result = await estimatePortfolio(houses);

      setResults(result);
    } catch (error) {
      setError("Error estimating portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <p className="uppercase tracking-[0.3em] text-[#6B705C] text-sm font-semibold">
          Portfolio Analysis
        </p>

        <h1 className="text-5xl md:text-6xl font-black mt-3">
          Analyze multiple properties
        </h1>

        <p className="text-gray-600 text-lg mt-5 leading-relaxed">
          Add multiple properties and use the machine learning model to estimate
          their individual and combined values.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Property cards */}
        <div className="space-y-6">
          {houses.map((house, index) => (
            <div
              key={index}
              className="bg-white border border-black/10 rounded-3xl p-7 shadow-sm"
            >
              <div className="flex items-center justify-between mb-7">
                <div>
                  <p className="text-[#6B705C] text-sm font-semibold uppercase tracking-widest">
                    Property {index + 1}
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    Property Information
                  </h2>
                </div>

                {houses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHouse(index)}
                    className="text-sm font-semibold text-red-600 hover:text-red-800 transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Input
                  label="Square Feet"
                  name="sqft"
                  value={house.sqft}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="1800"
                  min="300"
                  max="10000"
                />

                <Input
                  label="Bedrooms"
                  name="bedrooms"
                  value={house.bedrooms}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="3"
                  min="1"
                  max="10"
                />

                <Input
                  label="Bathrooms"
                  name="bathrooms"
                  value={house.bathrooms}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="2"
                  min="1"
                  max="10"
                  step="1"
                />

                <Input
                  label="House Age"
                  name="age"
                  value={house.age}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="12"
                  min="0"
                  max="150"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            type="button"
            onClick={addHouse}
            className="rounded-xl border border-[#111111]/20 px-6 py-3 font-bold hover:bg-[#111111] hover:text-white transition"
          >
            + Add Property
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#111111] px-7 py-3 font-bold text-white hover:bg-[#6B705C] transition disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Portfolio"}
          </button>
        </div>
      </form>

      {/* Results */}
      <ErrorMessage message={error} />
      <div className="mt-12">
        {loading && (
          <div className="bg-[#111111] rounded-3xl p-12 text-center">
            <LoadingSpinner />
          </div>
        )}

        {results && !loading && <PortfolioResults results={results} />}
      </div>
    </section>
  );
}

/* Input component */

function Input({ label, name, value, onChange, placeholder, min, max, step }) {
  return (
    <div>
      <label className="font-semibold text-[#111111]">{label}</label>

      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`e.g. ${placeholder}`}
        min={min}
        max={max}
        step={step}
        className="w-full mt-2 rounded-xl bg-[#F8F8F5] border border-black/10 p-4 outline-none focus:ring-2 focus:ring-[#6B705C] transition"
      />
    </div>
  );
}

/* Results */

function PortfolioResults({ results }) {
  return (
    <div>
      {/* Total */}
      <div className="bg-[#111111] rounded-3xl p-8 md:p-10 text-white">
        <p className="uppercase tracking-[0.3em] text-[#A5A58D] text-sm font-semibold">
          Portfolio Value
        </p>

        <h2 className="text-3xl font-bold mt-3">Total Estimated Value</h2>

        <p className="text-5xl md:text-6xl font-black mt-5">
          ${Number(results.totalPredictedPrice).toLocaleString()}
        </p>

        <p className="text-gray-400 mt-4">
          Based on {results.houses.length}{" "}
          {results.houses.length === 1 ? "property" : "properties"}.
        </p>
      </div>

      {/* Individual results */}
      <div className="mt-8">
        <h2 className="text-3xl font-black mb-6">Property Estimates</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.houses.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[#6B705C] text-sm font-semibold uppercase tracking-wider">
                    Property {index + 1}
                  </p>

                  <h3 className="text-2xl font-black mt-2">
                    {item.predictedPrice
                      ? `$${Number(item.predictedPrice).toLocaleString()}`
                      : "Unavailable"}
                  </h3>
                </div>
              </div>

              {item.status === "failed" ? (
                <p className="text-red-600 text-sm mt-5">{item.error}</p>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
                  <div className="bg-[#F8F8F5] rounded-xl p-3">
                    <span className="text-gray-500">Size</span>
                    <p className="font-bold">{item.house.sqft} ft²</p>
                  </div>

                  <div className="bg-[#F8F8F5] rounded-xl p-3">
                    <span className="text-gray-500">Bedrooms</span>
                    <p className="font-bold">{item.house.bedrooms}</p>
                  </div>

                  <div className="bg-[#F8F8F5] rounded-xl p-3">
                    <span className="text-gray-500">Bathrooms</span>
                    <p className="font-bold">{item.house.bathrooms}</p>
                  </div>

                  <div className="bg-[#F8F8F5] rounded-xl p-3">
                    <span className="text-gray-500">Age</span>
                    <p className="font-bold">{item.house.age} years</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
