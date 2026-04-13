import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiseaseDetectionForm from "../features/farmer-dashboard/modules/DiseaseDetectionForm";
import {
  AlertCircle,
  ShieldCheck,
  Zap,
  Info,
  ArrowRight,
  Pill,
  Microscope,
} from "lucide-react";

const DiseaseDetectionPage = () => {
  const [result, setResult] = useState(null);

  return (
    <div className="min-h-full bg-[#0f172a] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* LEFT: FORM */}
          <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Info size={16} className="text-teal-400" />
                <h2 className="text-sm font-semibold text-white">
                  Diagnostic Input
                </h2>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <DiseaseDetectionForm onResult={setResult} />
            </div>
          </div>

          {/* RIGHT: RESULTS */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]"
                >
                  <Zap className="text-slate-600 mb-4" size={40} />
                  <h3 className="text-white font-semibold">
                    Awaiting Analysis
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-xs">
                    Submit the form to generate a disease diagnosis and treatment plan.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* RESULT SUMMARY */}
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs text-teal-400 uppercase font-semibold">
                          Detected Disease
                        </p>
                        <h3 className="text-xl font-bold text-white capitalize">
                          {result.predicted_disease.replace(/_/g, " ")}
                        </h3>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">Confidence</p>
                        <p className="text-lg font-bold text-teal-400">
                          {(result.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 text-sm mt-4 ${
                        result.severity === "high"
                          ? "text-red-400"
                          : "text-teal-400"
                      }`}
                    >
                      <AlertCircle size={16} />
                      {result.severity} risk level detected
                    </div>
                  </div>

                  {/* PRIORITY ACTIONS */}
                  {result.priority_actions?.length > 0 && (
                    <div className="bg-slate-800 border border-red-500/30 rounded-xl p-6">
                      <div className="flex items-center gap-2 text-red-400 mb-4 text-sm font-semibold">
                        <Zap size={16} />
                        Urgent Actions
                      </div>

                      <ul className="space-y-3">
                        {result.priority_actions.map((a, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-300"
                          >
                            <ArrowRight size={14} className="mt-1 text-red-400" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* PREVENTION */}
                  {result.prevention?.length > 0 && (
                    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                      <div className="flex items-center gap-2 text-teal-400 mb-4 text-sm font-semibold">
                        <ShieldCheck size={16} />
                        Prevention Strategy
                      </div>

                      <ul className="space-y-3">
                        {result.prevention.map((p, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-slate-300"
                          >
                            <Pill size={14} className="mt-1 text-teal-400" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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