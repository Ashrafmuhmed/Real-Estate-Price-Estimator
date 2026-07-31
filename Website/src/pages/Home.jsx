import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Prediction",
    text: "Estimate residential property prices using a trained machine learning model.",
  },
  {
    title: "Fast Results",
    text: "Submit a few property details and receive an estimated value within seconds.",
  },
  {
    title: "Simple Experience",
    text: "A clean interface designed to make property estimation easy for everyone.",
  },
];

export default function Home() {
  return (
    <div className="bg-[#F8F8F5]">
      {/* Hero */}
      <section className="min-h-[calc(100vh-80px)] flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full py-20">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="uppercase tracking-[0.35em] text-[#6B705C] font-semibold text-sm"
            >
              AI Powered Real Estate
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-black tracking-tight mt-6 leading-[0.95]"
            >
              Know the value.
              <br />
              <span className="text-[#6B705C]">Make the move.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 max-w-2xl text-lg md:text-xl mt-8 leading-relaxed"
            >
              Predict residential property prices using Artificial Intelligence
              and Machine Learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link
                to="/estimate"
                className="rounded-xl bg-[#111111] px-8 py-4 font-bold text-white hover:bg-[#6B705C] transition"
              >
                Start Estimating
              </Link>

              <Link
                to="/about"
                className="rounded-xl border border-[#111111]/20 px-8 py-4 font-bold text-[#111111] hover:bg-[#111111] hover:text-white transition"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-5 mt-24">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.15 }}
                className="bg-white border border-black/10 rounded-2xl p-7 shadow-sm hover:shadow-md transition"
              >
                <div className="w-10 h-1 bg-[#6B705C] mb-6 rounded-full" />

                <h3 className="text-xl font-bold">{feature.title}</h3>

                <p className="text-gray-600 mt-3 leading-relaxed">
                  {feature.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Small information section */}
      <section className="bg-[#111111] text-white px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-[#A5A58D] text-sm font-semibold">
              From data to decisions
            </p>

            <h2 className="text-4xl md:text-5xl font-black mt-4">
              Property estimation powered by data.
            </h2>
          </div>

          <p className="text-gray-300 text-lg leading-relaxed">
            Our system combines a modern React interface with an Express API and
            a Python machine learning service to transform property information
            into an estimated market value.
          </p>
        </div>
      </section>
    </div>
  );
}
