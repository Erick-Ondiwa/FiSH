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
  ChevronRight,
  User,
  LogOut
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
    <div className="hidden md:flex flex-col w-72 h-screen bg-[#0f172a] text-white relative border-r border-white/5">
      
      {/* --- LOGO SECTION --- */}
      <div className="px-8 py-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-teal-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative p-2.5 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300">
              <Fish className="text-white" size={22} />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight leading-none">
              FiSH<span className="text-teal-400 font-extralight tracking-widest ml-1">AI</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Enterprise Advisory</span>
          </div>
        </div>
      </div>

      {/* --- NAVIGATION --- */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 opacity-60">
            Advisory Modules
          </span>
        </div>

        {loading ? (
          <div className="space-y-4 px-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-11 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          sections.map((section, index) => {
            const isActive = activeSection?.slug === section.slug;
            const IconComponent = sidebarIcons[index % sidebarIcons.length];

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section)}
                className="relative w-full group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 outline-none"
              >
                {/* --- BRAND GRADIENT ACTIVE PILL --- */}
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarPill"
                    className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-blue-800/20 to-transparent border-l-2 border-teal-500 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="relative z-10 flex items-center gap-4">
                  <div className={`transition-all duration-300 ${
                    isActive ? "text-teal-400 scale-110" : "text-slate-500 group-hover:text-slate-300"
                  }`}>
                    <IconComponent size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-sm font-semibold tracking-wide transition-all ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                  }`}>
                    {section.name}
                  </span>
                </div>

                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                  />
                )}
              </button>
            );
          })
        )}
      </nav>

      {/* --- USER FOOTER --- */}
      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-blue-700 flex items-center justify-center border border-white/10">
                <User size={18} className="text-blue-100" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-500 border-2 border-[#0f172a] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Agro-Business</p>
              <p className="text-[10px] text-teal-500/80 font-medium uppercase tracking-tighter">Pro Farmer</p>
            </div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all text-xs font-bold group">
            <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;