import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../../../api";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const GettingStarted = ({ setActiveSection }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------
  // Fetch onboarding data
  // ----------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
          `${API_URL}/advisory/onboarding/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.error("Failed to load onboarding:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-teal-600 animate-pulse">
        Loading your dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-red-500">
        Failed to load dashboard.
      </div>
    );
  }

  // ----------------------------------
  // Extract backend response
  // ----------------------------------
  const {
    welcome_message,
    completion_percentage,
    tasks,
  } = data;

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">

      {/* ---------------------------------- */}
      {/* HERO / WELCOME */}
      {/* ---------------------------------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase mb-2">
          <Sparkles size={14} /> Welcome
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900">
          {welcome_message || "Welcome to FiSH Platform"}
        </h1>

        <p className="text-slate-600 mt-3 max-w-2xl">
          Follow the guided steps below to successfully set up and manage your fish farming journey.
        </p>
      </motion.div>

      {/* ---------------------------------- */}
      {/* PROGRESS BAR */}
      {/* ---------------------------------- */}
      <div className="mb-10">
        <div className="flex justify-between mb-2 text-sm font-medium text-slate-600">
          <span>Onboarding Progress</span>
          <span>{completion_percentage}%</span>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-teal-500 h-3 rounded-full transition-all"
            style={{ width: `${completion_percentage}%` }}
          />
        </div>
      </div>

      {/* ---------------------------------- */}
      {/* TASK CARDS */}
      {/* ---------------------------------- */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {tasks.map((task) => {
          const isCompleted = task.completed;

          return (
            <motion.div
              key={task.slug}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-900">
                  {task.title}
                </h3>

                {isCompleted ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <Clock className="text-yellow-500" size={20} />
                )}
              </div>

              <p className="text-sm text-slate-600 mt-3">
                {task.description}
              </p>

              <button
                onClick={() => setActiveSection(task.slug)}
                className="mt-5 flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-800"
              >
                {isCompleted ? "Review" : "Start"} <ArrowRight size={16} />
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* ---------------------------------- */}
      {/* NEXT STEP CTA */}
      {/* ---------------------------------- */}
      {tasks.find((t) => !t.completed) && (
        <div className="mt-12 p-6 bg-teal-50 rounded-2xl border border-teal-100">
          <h4 className="text-lg font-bold text-teal-900">
            Next Step
          </h4>

          <p className="text-sm text-slate-600 mt-2">
            Continue your journey by completing the next recommended task.
          </p>

          <button
            onClick={() =>
              setActiveSection(tasks.find((t) => !t.completed).slug)
            }
            className="mt-4 bg-teal-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-teal-600"
          >
            Continue Setup
          </button>
        </div>
      )}
    </div>
  );
};

export default GettingStarted;