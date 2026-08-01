import { useState } from "react";
import { estimateHouse } from "../services/api";
import ResultCard from "../components/resultsCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Estimate() {
  const [form, setForm] = useState({
    sqft: "",
    bedrooms: "",
    bathrooms: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState(null);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.sqft || !form.bedrooms || !form.bathrooms || !form.age) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setPrice(null);

      const result = await estimateHouse(form);

      setPrice(result.predicted_price);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full mt-2 rounded-xl bg-[#F8F8F5] border border-black/10 p-4 text-[#111111] outline-none focus:ring-2 focus:ring-[#6B705C] focus:border-[#6B705C] transition";

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="max-w-3xl mb-12">
        <p className="uppercase tracking-[0.3em] text-[#6B705C] text-sm font-semibold">
          AI Valuation
        </p>

        <h1 className="text-5xl md:text-6xl font-black mt-3">
          Property Price Estimator
        </h1>

        <p className="text-gray-600 text-lg mt-5">
          Enter the basic characteristics of a property and let our machine
          learning model estimate its value.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-3xl border border-black/10 p-8 shadow-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Property Information</h2>

            <p className="text-gray-500 mt-2">
              Enter accurate information for a better estimate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-semibold">Square Feet</label>

              <input
                type="number"
                name="sqft"
                value={form.sqft}
                onChange={handleChange}
                placeholder="e.g. 1800"
                min="300"
                max="10000"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-semibold">Bedrooms</label>

              <input
                type="number"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                placeholder="e.g. 3"
                min="1"
                max="10"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-semibold">Bathrooms</label>

              <input
                type="number"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                placeholder="e.g. 2"
                min="1"
                max="10"
                step="1"
                className={inputClass}
              />
            </div>

            <div>
              <label className="font-semibold">House Age</label>

              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 12"
                min="0"
                max="150"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 rounded-xl bg-[#111111] py-4 font-bold text-white hover:bg-[#6B705C] transition disabled:opacity-50"
            >
              {loading ? "Estimating..." : "Estimate Property"}
            </button>
          </form>
        </div>

        {/* Result */}
        <div className="bg-[#111111] rounded-3xl p-8 text-white min-h-[500px] flex flex-col">
          <div>
            <p className="uppercase tracking-[0.25em] text-[#A5A58D] text-sm font-semibold">
              Machine Learning Result
            </p>

            <h2 className="text-3xl font-black mt-2">Estimated Value</h2>
          </div>

          <div className="flex-1 flex items-center justify-center">
            {loading ? <LoadingSpinner /> : <ResultCard price={price} />}
          </div>

          <p className="text-gray-400 text-sm text-center mt-6">
            This value is an AI-generated estimate and should not be considered
            a professional property appraisal.
          </p>
        </div>
      </div>
    </section>
  );
}
