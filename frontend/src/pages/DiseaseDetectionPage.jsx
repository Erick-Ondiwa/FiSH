import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiseaseDetectionForm from "../features/farmer-dashboard/modules/DiseaseDetectionForm";
import { Activity, AlertCircle, ShieldCheck, Zap, Info, ArrowRight, Pill, Microscope } from "lucide-react";

const DiseaseDetectionPage = () => {
  const [result, setResult] = useState(null);

  // Animation Variants for smooth entry
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- BRANDED HEADER SECTION --- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 rounded-[2.5rem] p-10 md:p-14 text-white shadow-2xl shadow-blue-900/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/10">
                  <Microscope className="text-teal-300" size={32} />
                </div>
                <span className="px-4 py-1 bg-teal-400/20 border border-teal-400/30 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-teal-100">
                  Biosafety AI
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1.1]">
                Health <span className="text-teal-300">Diagnostics</span>
              </h1>
              <p className="mt-6 text-blue-50/70 text-lg md:text-xl font-light leading-relaxed">
                Utilizing machine learning to cross-reference water parameters and symptoms for rapid pathogen identification.
              </p>
            </div>

            {/* Visual Metric Counter (Simulated) */}
            <div className="hidden lg:flex gap-10 border-l border-white/10 pl-10">
               <div className="text-center">
                 <p className="text-[10px] font-bold text-teal-200 uppercase tracking-widest opacity-60">Status</p>
                 <p className="text-2xl font-black mt-1">Active</p>
               </div>
               <div className="text-center">
                 <p className="text-[10px] font-bold text-teal-200 uppercase tracking-widest opacity-60">Confidence</p>
                 <p className="text-2xl font-black mt-1">98.2%</p>
               </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[5%] w-64 h-64 bg-teal-400/10 rounded-full blur-[80px]" />
        </header>

        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* --- LEFT: DIAGNOSTIC INPUT --- */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden"
          >
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <h2 className="text-sm font-black uppercase tracking-widest text-blue-900">Patient Data Input</h2>
              </div>
              <Info size={18} className="text-slate-300" />
            </div>
            <div className="p-8 md:p-12">
              <DiseaseDetectionForm onResult={setResult} />
            </div>
          </motion.div>

          {/* --- RIGHT: INTELLIGENT RESULTS --- */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-200 flex flex-col items-center justify-center h-full min-h-[500px]"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 transition-transform hover:rotate-12 duration-500">
                    <Zap className="text-slate-200" size={48} />
                  </div>
                  <h3 className="text-blue-900 font-black text-xl italic uppercase tracking-tighter">Waiting for Analysis</h3>
                  <p className="text-slate-400 text-sm mt-3 max-w-[240px] leading-relaxed">
                    Once you submit the diagnostic form, AI will generate a tailored health report here.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* --- THEMED RESULT CARD --- */}
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 relative overflow-hidden group">
                    <div className={`absolute top-0 left-0 w-full h-2 ${
                      result.severity === "high" ? "bg-red-500" : "bg-teal-500"
                    }`} />
                    
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4 inline-block">
                          Primary Pathogen
                        </span>
                        <h3 className="text-4xl font-black text-blue-900 capitalize tracking-tighter">
                          {result.predicted_disease.replace(/_/g, " ")}
                        </h3>
                      </div>
                      <div className="bg-blue-900 text-white p-4 rounded-2xl text-center min-w-[80px]">
                        <div className="text-2xl font-black">
                          {(result.confidence * 100).toFixed(0)}%
                        </div>
                        <div className="text-[8px] opacity-60 uppercase font-bold tracking-tighter">Certainty</div>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-2xl ${
                      result.severity === "high" ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-700"
                    }`}>
                      <AlertCircle size={20} />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {result.severity} Risk Alert level
                      </span>
                    </div>
                  </div>

                  {/* --- ACTIONABLE TILES --- */}
                  <div className="grid gap-6">
                    {/* Critical Intervention */}
                    {result.priority_actions?.length > 0 && (
                      <div className="bg-white p-8 rounded-[2rem] border border-red-100 shadow-lg shadow-red-900/5">
                        <div className="flex items-center gap-3 mb-6 text-red-600 font-black uppercase text-xs tracking-[0.2em]">
                          <Zap size={18} />
                          <h4>Urgent Protocols</h4>
                        </div>
                        <ul className="space-y-4">
                          {result.priority_actions.map((a, i) => (
                            <li key={i} className="flex items-start gap-4 text-sm text-slate-600 leading-relaxed font-medium">
                              <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                                <ArrowRight size={12} strokeWidth={3} />
                              </div>
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Proactive Prevention */}
                    <div className="bg-white p-8 rounded-[2rem] border border-blue-100 shadow-lg shadow-blue-900/5">
                      <div className="flex items-center gap-3 mb-6 text-blue-700 font-black uppercase text-xs tracking-[0.2em]">
                        <ShieldCheck size={18} />
                        <h4>Mitigation Strategy</h4>
                      </div>
                      <ul className="space-y-4">
                        {result.prevention?.map((p, i) => (
                          <li key={i} className="flex items-start gap-4 text-sm text-slate-600 font-medium leading-relaxed">
                            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                              <Pill size={12} strokeWidth={3} />
                            </div>
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetectionPage;