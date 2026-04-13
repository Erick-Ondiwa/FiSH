import React, { useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../../api";
import {
  AlertCircle,
  Loader2,
  Thermometer,
  Droplets,
  Waves,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";

const speciesOptions = ["Tilapia", "Catfish", "Trout", "Nile Perch"];
const ageOptions = ["Fingerlings", "Juvenile", "Mature"];

const symptomOptions = [
  "loss_of_appetite","lethargy","erratic_swimming","isolation",
  "surface_swimming","gasping_for_air","skin_lesions","ulcers",
  "fin_rot","scale_loss","body_swelling","discoloration",
  "eye_cloudiness","excess_mucus","gill_discoloration",
  "rapid_gill_movement","white_spots","fungal_growth","bloody_patches"
];

const DiseaseDetectionForm = ({ onResult }) => {
  const [formData, setFormData] = useState({
    species: "",
    age_group: "",
    symptoms: [],
    temperature: "",
    ph: "",
    oxygen: "",
    stocking_density: "",
    water_source: "",
    recent_deaths: false,
    death_rate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -------------------------
  // HANDLERS
  // -------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const toggleSymptom = (symptom) => {
    setFormData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.species || !formData.age_group || formData.symptoms.length === 0) {
      setError("Required: Species, Age Group, and at least one Symptom.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.post(
        `${API_URL}/ml/disease-detection/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onResult(res.data);
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // STYLES
  // -------------------------
  const input =
    "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40";

  const label =
    "text-xs uppercase tracking-wider text-slate-400 mb-1 block";

  const section =
    "bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* GENERAL */}
      <div className={section}>
        <h3 className="text-sm font-semibold text-white">
          General Information
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Species</label>
            <select name="species" value={formData.species} onChange={handleChange} className={input}>
              <option value="">Select</option>
              {speciesOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={label}>Age Group</label>
            <select name="age_group" value={formData.age_group} onChange={handleChange} className={input}>
              <option value="">Select</option>
              {ageOptions.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ENVIRONMENT */}
      <div className={section}>
        <h3 className="text-sm font-semibold text-white">
          Environment
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <input name="temperature" placeholder="Temperature °C" onChange={handleChange} className={input} />
          <input name="ph" placeholder="pH" onChange={handleChange} className={input} />
          <input name="oxygen" placeholder="Oxygen mg/L" onChange={handleChange} className={input} />
        </div>
      </div>

      {/* SYMPTOMS */}
      <div className={section}>
        <h3 className="text-sm font-semibold text-white">
          Symptoms
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
                {active && <CheckCircle2 size={12} className="inline mr-1" />}
                {s.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center justify-center gap-2 font-semibold transition"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <>
            Analyze <ChevronRight size={16} />
          </>
        )}
      </button>
    </form>
  );
};

export default DiseaseDetectionForm;