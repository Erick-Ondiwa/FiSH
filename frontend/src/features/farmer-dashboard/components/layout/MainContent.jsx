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
        <p className="text-gray-500 animate-pulse">
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
        <p className="text-gray-500">
          Select a section to view advisory guidance.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-10 overflow-y-auto">
      
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {guide.section.name}
        </h2>
        {guide.introduction && (
          <p className="mt-2 text-gray-600 max-w-2xl">
            {guide.introduction}
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="grid md:grid-cols-2 gap-6">
        {guide.steps.map((step) => (
          <motion.div
            key={step.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white shadow-md rounded-2xl overflow-hidden border border-gray-100"
          >
            {/* Image */}
            {step.image_url && (
              <img
                src={step.image_url}
                alt={step.title}
                className="w-full h-48 object-cover"
              />
            )}

            <div className="p-5">
              {/* Step Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Step {step.step_number}: {step.title}
                </h3>

                {step.is_mandatory && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    Mandatory
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-3 text-sm text-gray-600">
                {step.description}
              </p>

              {/* Action Button */}
              <button className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
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