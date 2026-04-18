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

// const Stat = ({ icon: Icon, label, value, unit, status }) => {
//   const statusColor =
//     status === "good"
//       ? "text-emerald-400"
//       : status === "warning"
//       ? "text-yellow-400"
//       : "text-red-400";

//   return (
//     <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
//       <div className="p-2 rounded-lg bg-slate-900">
//         <Icon className={`w-4 h-4 ${statusColor}`} />
//       </div>

//       <div className="leading-tight">
//         <p className="text-xs text-slate-400">{label}</p>
//         <p className="text-sm font-semibold text-white">
//           {value}
//           <span className="text-xs text-slate-400 ml-1">{unit}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

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

        {/* 🔹 STATS ROW */}
        {/* <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          <Stat
            icon={Thermometer}
            label="Water Temperature"
            value={data.temperature.value}
            unit="°C"
            status={data.temperature.status}
          />

          <Stat
            icon={Droplets}
            label="Dissolved Oxygen"
            value={data.oxygen.value}
            unit="mg/L"
            status={data.oxygen.status}
          />

          <Stat
            icon={Activity}
            label="pH Level"
            value={data.ph.value}
            unit=""
            status={data.ph.status}
          /> */}

          {/* LAST UPDATED */}
          {/* <div className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
            <div>
              <p className="text-xs text-slate-400">Last Updated</p>
              <p className="text-sm font-semibold text-white">
                {lastUpdated}
              </p>
            </div>
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default FarmConditionsHeader;