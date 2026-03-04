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
    <div
      className="
        hidden md:flex flex-col w-72 h-screen 
        bg-gradient-to-b 
        from-white/5 
        via-cyan-300/30 
        to-teal-200/40
        backdrop-blur-xl 
        border-r border-white/40
        shadow-2xl
        relative
      "
    >
      {/* Soft Water Light Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_50%)] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/40 relative z-10">
        <Fish className="text-cyan-700" size={30} />
        <h1 className="text-xl font-bold text-teal-900 tracking-wide">
          FiSH Advisory
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2 mt-6 relative z-10 px-3">
        {loading && (
          <p className="px-3 text-sm text-teal-700 animate-pulse">
            Loading sections...
          </p>
        )}

        {!loading &&
          sections.map((section) => {
            const isActive = activeSection === section.slug;
            const IconComponent = iconMap[section.icon] || Anchor;

            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.slug)}
                whileHover={{ scale: 1.03, x: 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 250 }}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-medium
                  rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? `
                        bg-gradient-to-r 
                        from-cyan-600 
                        to-teal-600 
                        text-white 
                        shadow-lg
                      `
                      : `
                        text-teal-900 
                        hover:bg-white/40 
                        hover:shadow-md
                      `
                  }
                `}
              >
                <span className={isActive ? "text-white" : "text-cyan-700"}>
                  <IconComponent size={20} />
                </span>
                <span>{section.name}</span>
              </motion.button>
            );
          })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 text-xs text-teal-800 border-t border-white/40 relative z-10">
        © {new Date().getFullYear()} FiSH Platform
      </div>
    </div>
  );
};

export default LeftSidebar;