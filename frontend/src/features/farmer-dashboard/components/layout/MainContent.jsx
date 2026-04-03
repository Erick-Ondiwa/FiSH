import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../../../../api";
import { MODULE_REGISTRY } from "../../modules";
import { Loader2, AlertCircle, BookOpen, Layout, ArrowRight } from "lucide-react";

const MainContent = ({ activeSection }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");
  const isModule = activeSection?.type === "module";
  const ModuleComponent = MODULE_REGISTRY[activeSection?.slug];

  useEffect(() => {
    if (!activeSection || isModule) return;

    const fetchGuide = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_URL}/advisory/guide/${activeSection.slug}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGuide(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load advisory guide.");
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [activeSection, isModule, token]);

  // --- THEMED WRAPPER ---
  const ContentWrapper = ({ children }) => (
    <div className="h-full w-full overflow-y-auto bg-[#f8fafc]">
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        {children}
      </div>
    </div>
  );

  // 1. MODULE RENDERING
  if (isModule && ModuleComponent) {
    return (
      <ContentWrapper>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <ModuleComponent />
        </motion.div>
      </ContentWrapper>
    );
  }

  // 2. LOADING (Using Teal/Blue accent)
  if (loading) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <Loader2 className="w-12 h-12 text-blue-700 animate-spin mb-4" />
          <p className="text-blue-900 font-medium animate-pulse">Fetching specialized insights...</p>
        </div>
      </ContentWrapper>
    );
  }

  // 3. ERROR (Themed to Blue/Teal instead of Red)
  if (error) {
    return (
      <ContentWrapper>
        <div className="bg-white border-l-4 border-blue-600 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <AlertCircle className="text-blue-600" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-blue-900">Notice</h4>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        </div>
      </ContentWrapper>
    );
  }

  // 4. EMPTY STATE
  if (!guide) {
    return (
      <ContentWrapper>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-900 to-teal-600 rounded-3xl rotate-12 flex items-center justify-center mb-6 shadow-xl shadow-blue-900/20">
            <Layout className="text-white -rotate-12" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-blue-900">Advisory Dashboard</h3>
          <p className="text-slate-500 max-w-xs mt-2">
            Select a module or guide from the sidebar to view detailed aquaculture recommendations.
          </p>
        </div>
      </ContentWrapper>
    );
  }

  // 5. GUIDE RENDERING
  return (
    <ContentWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 p-8 md:p-12 text-white shadow-2xl shadow-blue-900/30">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-teal-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-teal-100">Specialized Guide</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {guide.section.name}
            </h2>
            <p className="mt-6 text-blue-50/80 leading-relaxed max-w-2xl text-lg font-light">
              {guide.introduction}
            </p>
          </div>
          {/* Abstract background shape */}
          <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {guide.steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
            >
              <div className="relative">
                {step.image_url ? (
                  <img
                    src={step.image_url}
                    alt={step.title}
                    className="h-52 w-full object-cover rounded-[1.5rem]"
                  />
                ) : (
                  <div className="h-52 w-full bg-slate-50 rounded-[1.5rem] flex items-center justify-center">
                    <Layout size={40} className="text-slate-200" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-blue-900 w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-sm">
                  {step.step_number}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl text-blue-900 group-hover:text-blue-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                  {step.description}
                </p>
                <div className="mt-6 flex justify-end">
                  <div className="p-2 rounded-full bg-blue-50 text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </ContentWrapper>
  );
};

export default MainContent;