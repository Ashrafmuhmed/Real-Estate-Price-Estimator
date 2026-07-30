import { Brain, BarChart3, Zap } from "lucide-react";

import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 pb-32 px-6">
      <FeatureCard
        icon={<Brain size={50} />}
        title="Machine Learning"
        text="Regression models trained to estimate property prices."
      />

      <FeatureCard
        icon={<BarChart3 size={50} />}
        title="Portfolio Analysis"
        text="Estimate hundreds of homes in one request."
      />

      <FeatureCard
        icon={<Zap size={50} />}
        title="Lightning Fast"
        text="Powered by FastAPI with instant responses."
      />
    </section>
  );
}
