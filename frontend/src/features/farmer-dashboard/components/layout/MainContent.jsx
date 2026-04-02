import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../../../../api";
import { MODULE_REGISTRY } from "../../modules";

const MainContent = ({ activeSection }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  const isModule = activeSection?.type === "module";
  const ModuleComponent = MODULE_REGISTRY[activeSection?.slug];

  // --------------------------------------------------
  // Fetch Guide ONLY if type = guide
  // --------------------------------------------------
  useEffect(() => {
    if (!activeSection || isModule) return;

    const fetchGuide = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${API_URL}/advisory/guide/${activeSection.slug}/`,
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

  // --------------------------------------------------
  // MODULE RENDERING (NO API CALL)
  // --------------------------------------------------
  if (isModule && ModuleComponent) {
    return (
      <div className="p-10">
        <ModuleComponent />
      </div>
    );
  }

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="p-10">
        <p className="text-teal-600 animate-pulse">
          Loading advisory...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------
  if (error) {
    return (
      <div className="p-10 text-red-500">
        {error}
      </div>
    );
  }

  // --------------------------------------------------
  // EMPTY
  // --------------------------------------------------
  if (!guide) {
    return (
      <div className="p-10 text-gray-500">
        Select a section
      </div>
    );
  }

  // --------------------------------------------------
  // GUIDE RENDERING
  // --------------------------------------------------
  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold">
        {guide.section.name}
      </h2>

      <p className="mt-3 text-gray-600">
        {guide.introduction}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {guide.steps.map((step) => (
          <div key={step.id} className="bg-white p-5 rounded-xl shadow">
            {step.image_url && (
              <img
                src={step.image_url}
                alt={step.title}
                className="h-40 w-full object-cover rounded"
              />
            )}

            <h3 className="font-bold mt-3">
              Step {step.step_number}: {step.title}
            </h3>

            <p className="text-sm text-gray-600 mt-2">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;