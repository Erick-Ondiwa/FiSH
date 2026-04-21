import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../../../../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { TrendingUp, AlertTriangle, Activity } from "lucide-react";

const GrowthDashboard = () => {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FETCH DATA
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(`${API_URL}/ml/growth-history/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data.data || []);
        setLatest(res.data.latest || null);
      } catch (err) {
        console.error("Failed to fetch growth data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // -----------------------------
  // INSIGHTS ENGINE
  // -----------------------------
  const insights = useMemo(() => {
    if (!latest) return [];

    const messages = [];

    if (latest.feeding_consistency < 0.5) {
      messages.push({
        type: "warning",
        text: "Low feeding consistency detected. Increase feeding regularity.",
      });
    }

    if (latest.avg_protein < 25) {
      messages.push({
        type: "warning",
        text: "Protein levels are low. Consider higher protein feeds.",
      });
    }

    if (latest.temperature < 24 || latest.temperature > 32) {
      messages.push({
        type: "danger",
        text: "Water temperature is outside optimal range.",
      });
    }

    if (messages.length === 0) {
      messages.push({
        type: "success",
        text: "Growth conditions are optimal. Keep it up!",
      });
    }

    return messages;
  }, [latest]);

  // -----------------------------
  // REUSABLE COMPONENTS (✅ FIXED POSITION)
  // -----------------------------
  const MetricCard = ({ icon, label, value }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-3">
      <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
        {icon}
      </div>

      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
    </div>
  );

  const InsightCard = ({ insight }) => {
    const styles = {
      success: "bg-green-500/10 text-green-400 border-green-500/30",
      warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      danger: "bg-red-500/10 text-red-400 border-red-500/30",
    };

    return (
      <div
        className={`p-4 rounded-lg border text-sm ${styles[insight.type]}`}
      >
        {insight.text}
      </div>
    );
  };

  // -----------------------------
  // LOADING
  // -----------------------------
  if (loading) {
    return (
      <div className="text-slate-400 text-sm">
        Loading growth data...
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Growth Monitoring
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          AI-powered fish growth predictions and insights
        </p>
      </div>

      {/* METRICS */}
      {latest && (
        <div className="grid md:grid-cols-3 gap-5">

          <MetricCard
            icon={<TrendingUp size={18} />}
            label="Predicted Weight"
            value={`${latest.predicted_weight.toFixed(2)} g`}
          />

          <MetricCard
            icon={<Activity size={18} />}
            label="Feeding Consistency"
            value={`${(latest.feeding_consistency * 100).toFixed(0)}%`}
          />

          <MetricCard
            icon={<AlertTriangle size={18} />}
            label="Avg Protein"
            value={`${latest.avg_protein.toFixed(1)}%`}
          />

        </div>
      )}

      {/* CHART */}
      <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-5">
        <h3 className="text-white font-medium mb-4">
          Growth Trend (Predicted Weight)
        </h3>

        {data.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No growth data available yet.
          </p>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="predicted_weight"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* INSIGHTS */}
      <div className="space-y-3">
        <h3 className="text-white font-medium">
          Recommendations
        </h3>

        {insights.map((insight, i) => (
          <InsightCard key={i} insight={insight} />
        ))}
      </div>
    </div>
  );
};

export default GrowthDashboard;