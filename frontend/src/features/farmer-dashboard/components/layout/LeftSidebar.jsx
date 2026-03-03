import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Fish,
  Droplets,
  Apple,
  ShieldCheck,
  Activity,
  ShoppingBag,
  Anchor,
} from "lucide-react";
import { API_URL } from "../../../../../api";

// Map backend icon names to Lucide components
const iconMap = {
  Anchor: Anchor,
  Droplets: Droplets,
  Fish: Fish,
  Apple: Apple,
  ShieldCheck: ShieldCheck,
  Activity: Activity,
  ShoppingBag: ShoppingBag,
};

const LeftSidebar = ({ activeSection, setActiveSection }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
          `${API_URL}/advisory/sections/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSections(res.data);
      } catch (error) {
        console.error("Failed to fetch advisory sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  return (
    <div className="hidden md:flex flex-col w-64 h-screen bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg">
      
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <Fish className="text-blue-600" size={28} />
        <h1 className="text-xl font-bold text-blue-700 tracking-wide">
          FiSH Advisory
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 mt-4">
        {loading && (
          <p className="px-6 text-sm text-gray-500">Loading sections...</p>
        )}

        {!loading &&
          sections.map((section) => {
            const isActive = activeSection === section.slug;

            const IconComponent = iconMap[section.icon] || Anchor;

            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.slug)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all rounded-r-xl ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
              >
                <span className={isActive ? "text-white" : "text-blue-600"}>
                  <IconComponent size={20} />
                </span>
                <span>{section.name}</span>
              </motion.button>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 text-xs text-gray-500 border-t">
        © {new Date().getFullYear()} FiSH Platform
      </div>
    </div>
  );
};

export default LeftSidebar;