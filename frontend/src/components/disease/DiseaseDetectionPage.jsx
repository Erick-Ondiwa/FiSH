import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiseaseDetectionForm from "./DiseaseDetectionForm";
import axios from "axios";
import { API_URL } from "../../api";
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

  const [pond, setPond] = useState(null);
  const [water, setWater] = useState(null);
  const [loadingFarm, setLoadingFarm] = useState(true);

  useEffect(() => {
    const fetchFarmData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const [pondRes, waterRes] = await Promise.all([
          axios.get(`${API_URL}/farm/pond/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/farm/water-quality/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPond(pondRes.data?.[0] || pondRes.data || null);
        setWater(waterRes.data?.[0] || null); // latest record

      } catch (err) {
        console.error("Failed to fetch farm data", err);
      } finally {
        setLoadingFarm(false);
      }
    };

    fetchFarmData();
  }, []);


  const InfoItem = ({ label, value }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );

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

            {/* =========================
                FARM CONDITIONS (READ-ONLY)
            ========================= */}
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Microscope size={16} className="text-teal-400" />
                <h3 className="text-sm font-semibold text-white">
                  Current Farm Conditions
                </h3>
              </div>

              {loadingFarm ? (
                <p className="text-slate-400 text-sm">Loading farm data...</p>
              ) : !pond || !water ? (
                <p className="text-red-400 text-sm">
                  Missing pond or water data. Please update your farm.
                </p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

                  <InfoItem label="Species" value={pond.species} />
                  <InfoItem label="Fish Age" value={`${pond.age_days} days`} />
                  <InfoItem label="Density" value={pond.stocking_density.toFixed(4)} />

                  <InfoItem label="Temperature" value={`${water.temperature}°C`} />
                  <InfoItem label="pH" value={water.ph} />
                  <InfoItem label="Oxygen" value={`${water.dissolved_oxygen} mg/L`} />

                </div>
              )}

              <p className="text-xs text-slate-500 mt-4">
                These conditions are automatically used for disease analysis.
              </p>
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