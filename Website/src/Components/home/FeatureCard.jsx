import Card from "../ui/Card";
import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, text }) {
  return (
    <motion.div
      whileHover={{
        y: -10,
      }}
    >
      <Card>
        <div className="text-cyan-400 text-5xl">{icon}</div>

        <h2 className="text-2xl font-bold mt-5">{title}</h2>

        <p className="text-slate-400 mt-4">{text}</p>
      </Card>
    </motion.div>
  );
}
