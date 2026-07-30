import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="uppercase tracking-[0.5em] text-cyan-400"
      >
        AI Powered
      </motion.p>

      <motion.h1
        initial={{
          opacity: 0,
          y: 80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="text-6xl md:text-8xl font-black mt-6"
      >
        Real Estate
        <br />
        Price Estimator
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-slate-400 max-w-3xl text-xl mt-8"
      >
        Predict residential property prices using Artificial Intelligence and
        Machine Learning.
      </motion.p>

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.8,
        }}
        className="flex flex-wrap justify-center gap-6 mt-10"
      >
        <Link
          to="/estimate"
          className="rounded-xl bg-cyan-500 px-8 py-4 font-bold hover:bg-cyan-400 transition"
        >
          Start Estimating
        </Link>

        <Link
          to="/about"
          className="rounded-xl border border-white/20 px-8 py-4 hover:bg-white/10 transition"
        >
          Learn More
        </Link>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 mt-20 w-full max-w-6xl">
        <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-cyan-400">AI Prediction</h3>

          <p className="mt-3 text-slate-400">
            Estimate residential property prices using Machine Learning.
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-cyan-400">
            Portfolio Analysis
          </h3>

          <p className="mt-3 text-slate-400">
            Analyze multiple properties at once and compare their estimated
            values.
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 border border-white/10">
          <h3 className="text-xl font-bold text-cyan-400">Fast & Simple</h3>

          <p className="mt-3 text-slate-400">
            Get property estimates in seconds through a clean and responsive
            interface.
          </p>
        </div>
      </div>
    </section>
  );
}
