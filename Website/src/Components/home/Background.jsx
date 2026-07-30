import { motion } from "framer-motion";

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Top Blob */}

      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl -top-32 -left-32"
      />

      {/* Right Blob */}

      <motion.div
        animate={{
          x: [0, -70, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-3xl top-40 right-0"
      />

      {/* Bottom Blob */}

      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-3xl bottom-0 left-1/2"
      />
    </div>
  );
}
