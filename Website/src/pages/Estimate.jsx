import { useState } from "react";
import ResultCard from "../components/resultsCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { estimateHouse } from "../secrvices/api";

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
    if (!form.sqft || !form.bedrooms || !form.bathrooms || !form.age) {
      alert("Please fill in all fields.");
      return;
    }
    e.preventDefault();

    setLoading(true);

    // ============================
    // TODO:
    // Replace this with your API call
    //
    // const result = await estimateHouse(form);
    // setPrice(result.estimated_price);
    // ============================

    try {
      setLoading(true);

      const result = await estimateHouse(form);

      setPrice(result.predicted_price);
    } catch (error) {
      alert("Prediction failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-5xl font-black mb-10">Property Price Estimator</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Card */}

        <div className="rounded-3xl bg-slate-900 border border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-8">Property Information</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label>Square Feet</label>

              <input
                type="number"
                name="sqft"
                value={form.sqft}
                onChange={handleChange}
                className="w-full mt-2 rounded-xl bg-slate-800 p-4 outline-none"
              />
            </div>

            <div>
              <label>Bedrooms</label>

              <input
                type="number"
                name="bedrooms"
                value={form.bedrooms}
                onChange={handleChange}
                className="w-full mt-2 rounded-xl bg-slate-800 p-4 outline-none"
              />
            </div>

            <div>
              <label>Bathrooms</label>

              <input
                type="number"
                name="bathrooms"
                value={form.bathrooms}
                onChange={handleChange}
                className="w-full mt-2 rounded-xl bg-slate-800 p-4 outline-none"
              />
            </div>

            <div>
              <label>House Age</label>

              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full mt-2 rounded-xl bg-slate-800 p-4 outline-none"
              />
            </div>

            <button className="w-full mt-6 rounded-xl bg-cyan-500 py-4 font-bold hover:bg-cyan-400 transition">
              Estimate Property
            </button>
          </form>
        </div>

        {/* Right Card */}

        <div className="rounded-3xl bg-slate-900 border border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-8">AI Prediction</h2>

          {loading ? <LoadingSpinner /> : <ResultCard price={price} />}
        </div>
      </div>
    </section>
  );
}
