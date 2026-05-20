import { motion } from "framer-motion";
import { Apple, Activity, ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Smart Feeding System",
    icon: <Apple className="text-teal-400" size={28} />,
    desc: "Automated feeding schedules with real-time session tracking, alerts, and intelligent feed recommendations tailored to species and growth stage.",
    user: "Feeding Module",
  },
  {
    title: "Growth Monitoring & Insights",
    icon: <Activity className="text-teal-400" size={28} />,
    desc: "Track fish growth, biomass, survival rate, and performance trends using data-driven analytics to optimize farm productivity.",
    user: "Growth Module",
  },
  {
    title: "AI Disease Detection",
    icon: <ShieldCheck className="text-teal-400" size={28} />,
    desc: "Detect fish diseases using AI-powered diagnosis based on symptoms and farm conditions, with actionable treatment and prevention guidance.",
    user: "Health Module",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative bg-slate-900 overflow-hidden py-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        
        {/* HEADER */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Core System Modules
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          FiSH is built around intelligent modules that help farmers manage feeding,
          monitor growth, and detect diseases early—ensuring efficient, data-driven aquaculture.
        </motion.p>

        {/* CARDS */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative rounded-xl p-6 bg-slate-800 border border-slate-700 shadow-md hover:shadow-teal-500/10 hover:-translate-y-1
                        transition-all duration-300 text-left flex flex-col items-start"
            >
              {/* ICON */}
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-700 mb-5">
                {feature.icon}
              </div>

              {/* TEXT */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>

              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                {feature.desc}
              </p>

              <p className="text-teal-400 text-xs font-medium uppercase tracking-wide">
                {feature.user}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;