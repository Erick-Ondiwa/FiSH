import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { API_URL } from "../../../../../api";
import { MODULE_REGISTRY } from "../../modules";
import {
  Loader2,
  AlertCircle,
  BookOpen,
  Layout,
  ArrowRight,
} from "lucide-react";

const MainContent = ({ activeSection }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");
  const isModule = activeSection?.type === "module";
  const moduleEntry = MODULE_REGISTRY[activeSection?.slug];
  const ModuleComponent = moduleEntry?.Component;
  const ModuleHeader = moduleEntry?.Header;

  useEffect(() => {
    if (!activeSection || isModule) return;

    const fetchGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_URL}/advisory/guide/${activeSection.slug}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setGuide(res.data);
      } catch (err) {
        setError(
          err.response?.data?.detail || "Unable to load advisory guide."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [activeSection, isModule, token]);

  // 🔹 HEADER (FULL WIDTH, ALWAYS TOP)
  const Header = () => {
    if (!guide) return null;

    return (
      <div className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-teal-400" />
            <span className="text-xs uppercase tracking-wider text-teal-400 font-semibold">
              Guide
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {guide.section.name}
          </h1>

          <p className="mt-3 text-slate-400 max-w-2xl">
            {guide.introduction}
          </p>
        </div>
      </div>
    );
  };

  // 🔹 CONTENT WRAPPER (SCROLLABLE AREA ONLY)
  const ContentWrapper = ({ children }) => (
    <div className="flex-1 overflow-y-auto bg-[#0f172a]">
      <div className="p-6 md:p-10 max-w-7xl mx-auto">{children}</div>
    </div>
  );

  // ===========================
  // MODULE
  // ===========================
  if (isModule && ModuleComponent) {
    return (
      <div className="flex flex-col h-full">
        {/* ✅ FULL-WIDTH HEADER */}
        {ModuleHeader && <ModuleHeader />}

        {/* ✅ SCROLLABLE CONTENT */}
        <ContentWrapper>
          <ModuleComponent />
        </ContentWrapper>
      </div>
    );
  }
  // ===========================
  // LOADING
  // ===========================
  if (loading) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="w-10 h-10 text-teal-400 animate-spin mb-4" />
          <p className="text-slate-400">Loading advisory guide...</p>
        </div>
      </ContentWrapper>
    );
  }

  // ===========================
  // ERROR
  // ===========================
  if (error) {
    return (
      <ContentWrapper>
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-center gap-4">
          <AlertCircle className="text-teal-400" />
          <p className="text-slate-300">{error}</p>
        </div>
      </ContentWrapper>
    );
  }

  // ===========================
  // EMPTY
  // ===========================
  if (!guide) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <Layout size={40} className="text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-white">
            Advisory Dashboard
          </h3>
          <p className="text-slate-400 mt-2 max-w-sm">
            Select a guide or module from the sidebar.
          </p>
        </div>
      </ContentWrapper>
    );
  }

  // ===========================
  // GUIDE VIEW
  // ===========================
  return (
    <div className="flex flex-col h-full">
      {/* ✅ FULL-WIDTH HEADER */}
      <Header />

      {/* ✅ CONTENT BELOW HEADER */}
      <ContentWrapper>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
          {guide.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-teal-500/40 transition"
            >
              {step.image_url ? (
                <img
                  src={step.image_url}
                  alt={step.title}
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="h-44 flex items-center justify-center bg-slate-900">
                  <Layout className="text-slate-600" />
                </div>
              )}

              <div className="p-5">
                <h3 className="text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 mt-2">
                  {step.description}
                </p>

                <div className="mt-4 flex justify-end">
                  <ArrowRight className="text-teal-400" size={18} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default MainContent;