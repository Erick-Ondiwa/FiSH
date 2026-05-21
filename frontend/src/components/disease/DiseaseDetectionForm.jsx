import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../api";
import {
  AlertCircle,
  Loader2,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

// -------------------------
// SYMPTOMS
// -------------------------
const symptomOptions = [
  "loss_of_appetite","lethargy","erratic_swimming","isolation",
  "surface_swimming","gasping_for_air","skin_lesions","ulcers",
  "fin_rot","scale_loss","body_swelling","discoloration",
  "eye_cloudiness","excess_mucus","gill_discoloration",
  "rapid_gill_movement","white_spots","fungal_growth","bloody_patches"
];

const DiseaseDetectionForm = ({ onResult }) => {
  const [formData, setFormData] = useState({
    symptoms: [],
    recent_deaths: false,
    death_rate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------
  // HANDLERS
  // -------------------------
  const toggleSymptom = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // -------------------------
  // SUBMIT
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.symptoms.length === 0) {
      setError("Select at least one symptom.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      const payload = {
        ...formData,
        death_rate: formData.death_rate
          ? parseFloat(formData.death_rate)
          : 0,
      };

      const res = await axios.post(
        `${API_URL}/ml/disease-detection/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onResult(res.data);

    } catch (err) {
      setError("Detection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // STYLES
  // -------------------------
  const section =
    "bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5";

  const input =
    "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40";

  const label =
    "text-xs uppercase tracking-wider text-slate-400 mb-1 block";

  // -------------------------
  // UI
  // -------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* =========================
          SYMPTOMS
      ========================= */}
      <div className={section}>
        <h3 className="text-sm font-semibold text-white">
          Observed Symptoms
        </h3>

        <div className="flex flex-wrap gap-2">
          {symptomOptions.map((s) => {
            const active = formData.symptoms.includes(s);

            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-lg text-xs border transition
                  ${
                    active
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:border-teal-400"
                  }`}
              >
                {active && (
                  <CheckCircle2 size={12} className="inline mr-1" />
                )}
                {s.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================
          MORTALITY INFO
      ========================= */}
      <div className={section}>
        <h3 className="text-sm font-semibold text-white">
          Mortality Information
        </h3>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="recent_deaths"
            checked={formData.recent_deaths}
            onChange={handleChange}
          />
          <label className="text-sm text-slate-300">
            Recent fish deaths observed
          </label>
        </div>

        {formData.recent_deaths && (
          <div>
            <label className={label}>Estimated Death Rate (%)</label>
            <input
              type="number"
              name="death_rate"
              value={formData.death_rate}
              onChange={handleChange}
              className={input}
              placeholder="e.g. 5"
            />
          </div>
        )}
      </div>

      {/* =========================
          SUBMIT
      ========================= */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold transition"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            Analyze Disease <ChevronRight size={16} />
          </>
        )}
      </button>
    </form>
  );
};

export default DiseaseDetectionForm;