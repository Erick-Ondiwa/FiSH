import React from "react";
import { motion } from "framer-motion";
import {
  Fish,
  Droplets,
  Apple,
  ShieldCheck,
  Activity,
  ShoppingBag,
  Anchor,
} from "lucide-react";

const menuItems = [
  { id: "GettingStarted", label: "Getting Started", icon: <Anchor size={20} /> },
  { id: "FarmingSetup", label: "Farming Place Setup", icon: <Droplets size={20} /> },
  { id: "FishSourcing", label: "Sourcing of Fish", icon: <Fish size={20} /> },
  { id: "FeedingHabits", label: "Feeding Habits", icon: <Apple size={20} /> },
  { id: "DiseaseControl", label: "Disease Control", icon: <ShieldCheck size={20} /> },
  { id: "GrowthMonitoring", label: "Growth Monitoring", icon: <Activity size={20} /> },
  { id: "Marketing", label: "Marketing", icon: <ShoppingBag size={20} /> },
];

const LeftSidebar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-white/80 backdrop-blur-md border-r border-white/40 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/30">
        <Fish className="text-blue-600" size={28} />
        <h1 className="text-xl font-bold text-blue-700 tracking-wide">FiSH</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-500 to-teal-400 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <span className={isActive ? "text-white" : "text-blue-600"}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-gray-500 border-t border-white/30">
        © {new Date().getFullYear()} FiSH Platform
      </div>
    </div>
  );
};

export default LeftSidebar;
