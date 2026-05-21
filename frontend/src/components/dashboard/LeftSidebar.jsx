import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  Droplets,
  Apple,
  ShieldCheck,
  Activity,
  User,
  LogOut
} from "lucide-react";

// ✅ IMPORT LOGO
import FishLogo from "../../assets/FiSH-logo.png";

const sections = [
  {
    id: 1,
    name: "Farm Conditions",
    slug: "farm-conditions",
    icon: Droplets,
  },
  {
    id: 2,
    name: "Feeding",
    slug: "feeding",
    icon: Apple,
  },
  {
    id: 3,
    name: "Growth Monitoring",
    slug: "growth-monitoring",
    icon: Activity,
  },
  {
    id: 4,
    name: "Disease Detection",
    slug: "disease-detection",
    icon: ShieldCheck,
  },
];

const LeftSidebar = ({ activeSection, setActiveSection }) => {
  const navigate = useNavigate();

  // ✅ USER INFO (replace with real auth context if available)
  const user = {
    fullName: "Erick Ondiwa",
    role: "Farmer",
  };

  // ✅ LOGOUT HANDLER
  const handleLogout = () => {
    // Clear auth tokens
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Optional: clear other app state
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="hidden md:flex flex-col w-72 h-screen bg-[#0f172a] text-white border-r border-white/5">

      {/* =========================
          LOGO SECTION
      ========================= */}
      <div className="px-8 py-8">
        <div className="flex items-center gap-2 cursor-pointer">

          {/* ✅ REAL LOGO */}
          <img
            src={FishLogo}
            alt="FiSH Logo"
            className="w-20 object-contain rounded-lg"
          />

          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight leading-none">
              FiSH<span className="text-teal-400 ml-1">AI</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Smart Aquaculture
            </span>
          </div>
        </div>
      </div>

      {/* =========================
          NAVIGATION
      ========================= */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">

        <div className="px-4 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 opacity-60">
            Modules
          </span>
        </div>

        {sections.map((section) => {
          const isActive = activeSection?.slug === section.slug;
          const IconComponent = section.icon;

          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section)}
              className="relative w-full group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
            >
              {/* ACTIVE BACKGROUND */}
              {isActive && (
                <motion.div
                  layoutId="activeSidebarPill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent border-l-2 border-teal-500"
                />
              )}

              <div className="relative z-10 flex items-center gap-3">
                <IconComponent
                  size={18}
                  className={
                    isActive
                      ? "text-teal-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  }
                />

                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                >
                  {section.name}
                </span>
              </div>

              {isActive && (
                <div className="relative z-10 w-1.5 h-1.5 rounded-full bg-teal-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* =========================
          USER FOOTER
      ========================= */}
      <div className="p-4">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-md">

          {/* PROFILE */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-900 to-blue-700 flex items-center justify-center">
                <User size={18} className="text-blue-100" />
              </div>

              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-500 border-2 border-[#0f172a] rounded-full" />
            </div>

            <div className="flex-1 min-w-0">
              {/* ✅ FULL NAME */}
              <p className="text-sm font-semibold text-white truncate">
                {user.fullName}
              </p>

              {/* ✅ ROLE */}
              <p className="text-[10px] text-teal-400 uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition text-xs font-semibold group"
          >
            <LogOut
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Logout
          </button>

        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;