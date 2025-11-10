import { motion } from "framer-motion";
import {
  Brain,
  CloudSun,
  ShoppingCart,
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Advisory",
    icon: <Brain className="text-blue-700" size={28} />,
    desc: "Get personalized recommendations on pond management, feeding schedules, and disease control powered by artificial intelligence.",
    user: "For Farmers",
  },
  {
    title: "Weather & Water Insights",
    icon: <CloudSun className="text-blue-700" size={28} />,
    desc: "Access real-time weather and water quality updates to optimize fish production and ensure safety for fishermen.",
    user: "For Farmers & Fishermen",
  },
  {
    title: "Smart Market Linkages",
    icon: <ShoppingCart className="text-blue-700" size={28} />,
    desc: "Connect directly with verified buyers and sellers, access pricing data, and trade securely through digital fish markets.",
    user: "For Buyers & Sellers",
  },

];

const Features = () => {
  return (
    <section
    //  bg-gradient-to-br from-blue-900/40 via-blue-700/30 to-teal-600/20 backdrop-blur-md
      id="features"
      className="relative py-24 bg-gradient-to-br from-blue-900/40 via-blue-700/30 to-teal-600/20 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] bg-blue-200/30 rounded-full blur-3xl -top-40 -left-40 animate-pulse"></div>
        <div className="absolute w-[700px] h-[700px] bg-cyan-300/20 rounded-full blur-3xl -bottom-60 right-0 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Section Header */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-blue-900 mb-4"
        >
          Useful Features
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-700 max-w-2xl mx-auto mb-14 leading-relaxed"
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
              className="relative rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 
                        transition-all duration-500 text-left
                        bg-gradient-to-br from-[#E0F7FA]/90 via-[#B2EBF2]/80 to-[#80DEEA]/90 
                        border border-cyan-200/30 backdrop-blur-lg"
            >
              {/* Floating Light Effect */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-300/40 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-300/30 rounded-full blur-2xl"></div>

              {/* Icon */}
              <div className="flex items-center justify-center w-14 h-14 rounded-full 
                              bg-gradient-to-r from-cyan-100 to-blue-100 shadow-inner mb-5">
                {feature.icon}
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-cyan-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                {feature.desc}
              </p>
              <p className="text-cyan-700 text-xs font-medium uppercase tracking-wide">
                {feature.user}
              </p>

              {/* Subtle Glow on Hover */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br 
                              from-cyan-100/10 via-transparent to-blue-100/10 opacity-0 
                              group-hover:opacity-100 transition duration-700"></div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
