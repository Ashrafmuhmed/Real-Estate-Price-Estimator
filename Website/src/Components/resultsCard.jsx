export default function ResultCard({ price }) {
  if (!price) {
    return (
      <div className="text-slate-400">
        Fill in the form and click
        <strong> Estimate Property</strong>.
      </div>
    );
  }

  return (
    <div>
      <p className="text-slate-400">Estimated Price</p>

      <h1 className="text-6xl font-black mt-4 text-cyan-400">
        ${price.toLocaleString()}
      </h1>

      <div className="mt-8">
        <p className="text-green-400">Prediction completed successfully</p>
      </div>
    </div>
  );
}
