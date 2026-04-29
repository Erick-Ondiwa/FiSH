import React from "react";
import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Activity,
  RefreshCw,
  Bell,
  History,
  MapPin,
} from "lucide-react";

const FarmConditionsHeader = ({
  farmName = "Main Fish Farm",
  pondName = "Pond A",
  lastUpdated = "Just now",
  data = {
    temperature: { value: 27, status: "good" },
    oxygen: { value: 6.5, status: "good" },
    ph: { value: 7.8, status: "warning" },
  },
  onRefresh,
  onShowAlerts,
  onShowHistory,
}) => {
  return (
    <div className="w-full bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-5">

        {/* 🔹 TOP ROW */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* LEFT: CONTEXT */}
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
              <MapPin size={14} />
              <span>{farmName}</span>
              <span>•</span>
              <span>{pondName}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Farm Conditions
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              Real-time environmental monitoring and alerts
            </p>
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              onClick={onShowAlerts}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition"
            >
              <Bell size={16} />
              Alerts
            </button>

            <button
              onClick={onShowHistory}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition"
            >
              <History size={16} />
              History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmConditionsHeader;