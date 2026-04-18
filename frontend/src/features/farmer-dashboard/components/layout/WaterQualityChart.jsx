import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const WaterQualityChart = ({ data }) => {
  const [metric, setMetric] = useState("temperature");

  const metricConfig = {
    temperature: {
      label: "Temperature (°C)",
      color: "#14b8a6",
    },
    dissolved_oxygen: {
      label: "Dissolved Oxygen (mg/L)",
      color: "#3b82f6",
    },
    ph: {
      label: "pH",
      color: "#a855f7",
    },
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Water Quality Trends</h3>

        {/* TOGGLE */}
        <div className="flex gap-2">
          {Object.keys(metricConfig).map((key) => (
            <button
              key={key}
              onClick={() => setMetric(key)}
              className={`px-3 py-1 text-xs rounded-lg ${
                metric === key
                  ? "bg-teal-500 text-white"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {metricConfig[key].label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      {data?.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis
              dataKey="recorded_at"
              tickFormatter={formatDate}
              stroke="#94a3b8"
            />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
              }}
              labelFormatter={formatDate}
            />

            <Line
              type="monotone"
              dataKey={metric}
              stroke={metricConfig[metric].color}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-slate-400 text-sm">
          No water data available yet.
        </p>
      )}
    </div>
  );
};

export default WaterQualityChart;