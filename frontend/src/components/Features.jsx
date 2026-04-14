import { motion } from "framer-motion";
import { Brain, CloudSun, ShoppingCart } from "lucide-react";

const features = [
  {
    title: "AI-Powered Advisory",
    icon: <Brain className="text-teal-400" size={28} />,
    desc: "Get personalized recommendations on pond management, feeding schedules, and disease control powered by artificial intelligence.",
    user: "For Farmers",
  },
  {
    title: "Weather & Water Insights",
    icon: <CloudSun className="text-teal-400" size={28} />,
    desc: "Access real-time weather and water quality updates to optimize fish production and ensure safety for fishermen.",
    user: "For Farmers & Fishermen",
  },
  {
    title: "Smart Market Linkages",
    icon: <ShoppingCart className="text-teal-400" size={28} />,
    desc: "Connect directly with verified buyers and sellers, access pricing data, and trade securely through digital fish markets.",
    user: "For Buyers & Sellers",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="relative bg-slate-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-white mb-4"
        >
          Useful Features
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-slate-400 max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          FiSH integrates cutting-edge technologies to empower every player in
          the fishery ecosystem, from aspiring farmers and fishermen to active
          traders and mentors, making aquaculture smarter, sustainable, and
          profitable.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="relative rounded-xl p-6 bg-slate-800 border border-slate-700 shadow-md hover:shadow-lg 
                        transition-all duration-300 text-left flex flex-col items-start"
            >
              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-slate-700 mb-5">
                {feature.icon}
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-2">
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