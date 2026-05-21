import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";
import {
  AlertTriangle,
  ShieldCheck,
  ArrowLeft,
  Activity,
} from "lucide-react";

const DiseaseLog = ({ onClose }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FETCH LOGS
  // -----------------------------
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(`${API_URL}/ml/disease-history/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setLogs(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch disease logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return <p className="text-slate-400 text-sm">Loading disease logs...</p>;
  }

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (logs.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <ShieldCheck className="mx-auto mb-4" size={40} />
        <p>No disease records found.</p>
      </div>
    );
  }

  const TimelineItem = ({ log }) => {
    const severityStyles = {
        low: "bg-green-500/10 text-green-400 border-green-500/30",
        medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
        high: "bg-red-500/10 text-red-400 border-red-500/30",
    };

    const iconMap = {
        low: <ShieldCheck size={16} />,
        medium: <Activity size={16} />,
        high: <AlertTriangle size={16} />,
    };

    return (
        <div className="relative">

        {/* TIMELINE DOT */}
        <div className="absolute -left-[30px] top-2 w-3 h-3 rounded-full bg-teal-400"></div>

        {/* CARD */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-4">

            {/* TOP ROW */}
            <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                
                <div className={`p-2 rounded-lg ${severityStyles[log.severity]}`}>
                {iconMap[log.severity]}
                </div>

                <div>
                <p className="text-white font-medium">
                    {log.disease}
                </p>
                <p className="text-xs text-slate-400">
                    {new Date(log.date).toLocaleString()}
                </p>
                </div>

            </div>

            <span
                className={`text-xs px-2 py-1 rounded-full border ${severityStyles[log.severity]}`}
            >
                {log.severity.toUpperCase()}
            </span>
            </div>

            {/* SYMPTOMS */}
            <div>
            <p className="text-xs text-slate-400 mb-1">Symptoms Observed</p>
            <div className="flex flex-wrap gap-2">
                {log.symptoms.map((s, i) => (
                <span
                    key={i}
                    className="text-xs px-2 py-1 bg-slate-700 rounded-md text-slate-300"
                >
                    {s.replace(/_/g, " ")}
                </span>
                ))}
            </div>
            </div>

            {/* ACTIONS */}
            <div>
            <p className="text-xs text-slate-400 mb-1">Recommended Actions</p>
            <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                {log.actions.map((a, i) => (
                <li key={i}>{a}</li>
                ))}
            </ul>
            </div>

        </div>
        </div>
    );
    };

  return (
    <div className="space-y-8">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Disease Log
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Historical disease detection and health insights
          </p>
        </div>

        {/* 🔥 EXIT BUTTON */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* =========================
          TIMELINE
      ========================= */}
      <div className="relative border-l border-slate-700 pl-6 space-y-8">

        {logs.map((log, index) => (
          <TimelineItem key={log.id} log={log} isLast={index === logs.length - 1} />
        ))}

      </div>
    </div>

    
  );
};

export default DiseaseLog;
