export default function ResultCard({ price }) {
  if (price === null || price === undefined) {
    return (
      <div className="text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-[#6B705C]/20 flex items-center justify-center mb-6">
          <span className="text-2xl">⌂</span>
        </div>

        <h3 className="text-2xl font-bold text-white">
          Your estimate will appear here
        </h3>

        <p className="text-gray-400 mt-3 max-w-sm">
          Enter the property information and click{" "}
          <span className="text-[#A5A58D] font-semibold">
            Estimate Property
          </span>{" "}
          to receive an AI-powered prediction.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center w-full">
      <p className="uppercase tracking-[0.25em] text-[#A5A58D] text-sm font-semibold">
        Predicted Property Value
      </p>

      <div className="mt-5">
        <span className="text-5xl md:text-6xl font-black text-white">
          ${Number(price).toLocaleString()}
        </span>
      </div>

      <div className="mt-8 mx-auto max-w-sm rounded-2xl bg-white/5 border border-white/10 p-5">
        <p className="text-gray-400 text-sm">
          Estimated using the project's machine learning prediction model.
        </p>
      </div>
    </div>
  );
}
