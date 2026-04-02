import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Fish,
  Droplets,
  Apple,
  ShieldCheck,
  Activity,
  ShoppingBag,
  Anchor,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { API_URL } from "../../../../../api";

const sidebarIcons = [Fish, Droplets, Apple, ShieldCheck, Activity, ShoppingBag, Anchor];

const LeftSidebar = ({ activeSection, setActiveSection }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`${API_URL}/advisory/sections/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
    <div className="hidden md:flex flex-col w-72 h-screen bg-slate-900 text-white border-r border-slate-200 shadow-sm relative">
      
      {/* --- LOGO SECTION --- */}
      <div className="px-8 py-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 bg-teal-600 rounded-xl shadow-lg shadow-teal-200 group-hover:rotate-12 transition-transform duration-300">
            <Fish className="text-white" size={24} />
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            FiSH <span className="text-teal-600">Advisory</span>
          </h1>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-4 space-y-1">
        <div className="px-4 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Learning Path
          </span>
        </div>

        {loading ? (
          <div className="space-y-4 px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          sections.map((section, index) => {
            const isActive = activeSection === section.slug;
            const IconComponent = sidebarIcons[index % sidebarIcons.length];

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section)}
                className="relative w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
              >
                {/* --- FLOATING ACTIVE INDICATOR --- */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-white shadow-sm border border-slate-200 rounded-xl z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? "text-teal-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}>
                    <IconComponent size={18} />
                  </div>
                  <span className={`text-sm font-bold transition-colors ${
                    isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
                  }`}>
                    {section.name}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10"
                  >
                    <ChevronRight size={14} className="text-teal-600" />
                  </motion.div>
                )}
              </button>
            );
          })
        )}
      </nav>

      {/* --- PREMIUM SUPPORT CARD --- */}
      {/* <div className="px-4 mb-6">
        <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle size={16} className="text-teal-600" />
            <span className="text-xs font-bold text-teal-900">Need Help?</span>
          </div>
          <p className="text-[11px] text-teal-700 leading-relaxed">
            Stuck on a section? Contact an advisor for expert guidance.
          </p>
          <button className="mt-3 w-full py-2 bg-white border border-teal-200 rounded-lg text-[11px] font-bold text-teal-700 hover:bg-teal-100 transition-colors">
            Chat with Expert
          </button>
        </div>
      </div> */}

      {/* --- FOOTER --- */}
      <div className="px-8 py-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-white shadow-sm overflow-hidden">
            {/* User Avatar could go here */}
            <div className="w-full h-full bg-gradient-to-tr from-slate-400 to-slate-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">Farmer Account</p>
            <p className="text-[10px] text-slate-500 truncate">Premium Member</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;