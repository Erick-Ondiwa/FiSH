import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
import { API_URL } from "../../../../../api";

const MainContent = ({ activeSection }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeSection) return;

    const fetchGuide = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");

        const res = await axios.get(
          `${API_URL}/advisory/guide/${activeSection}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setGuide(res.data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
          "Unable to load advisory guide."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGuide();
  }, [activeSection]);

  // -----------------------------
  // Loading State
  // -----------------------------
  if (loading) {
    return (
      <div className="flex-1 p-10">
        <p className="text-teal-700 animate-pulse">
          Loading advisory content...
        </p>
      </div>
    );
  }

  // -----------------------------
  // Error State
  // -----------------------------
  if (error) {
    return (
      <div className="flex-1 p-10">
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // Empty State
  // -----------------------------
  if (!guide) {
    return (
      <div className="flex-1 p-10">
        <p className="text-slate-600">
          Select a section to view advisory guidance.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 overflow-y-auto relative z-10">
      
      {/* Section Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-teal-900">
          {guide.section.name}
        </h2>
        {guide.introduction && (
          <p className="mt-3 text-slate-700 max-w-3xl leading-relaxed">
            {guide.introduction}
          </p>
        )}
      </div>

      {/* Steps Grid */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {guide.steps.map((step) => (
          <motion.div
            key={step.id}
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="
              rounded-2xl 
              overflow-hidden 
              backdrop-blur-lg 
              bg-gradient-to-br 
              from-white/60 
              via-cyan-50/70 
              to-teal-100/60
              border border-white/50
              shadow-xl
              hover:shadow-2xl
              transition-all
              duration-300
            "
          >
            {/* Image */}                                                                                                                                               
            {step.image_url && (
              <img
                src={step.image_url}
                alt={step.title}
                className="w-full h-44 object-cover"
              />
            )}

            <div className="p-6">
              {/* Step Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-teal-900">
                  Step {step.step_number}: {step.title}
                </h3>

                {step.is_mandatory && (
                  <span className="text-xs bg-cyan-200 text-cyan-900 px-3 py-1 rounded-full font-medium">
                    Mandatory
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-slate-700 leading-relaxed">
                {step.description}
              </p>

              {/* Action Button */}
              <button className="
                mt-5 
                flex 
                items-center 
                gap-2 
                text-sm 
                font-semibold 
                text-teal-700 
                hover:text-teal-900
                transition-colors
              ">
                <CheckCircle size={16} />
                Start Step
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;