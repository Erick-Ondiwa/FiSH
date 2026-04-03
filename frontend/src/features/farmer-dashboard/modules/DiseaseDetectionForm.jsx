import React, { useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../../api";
import { 
  AlertCircle, 
  Loader2, 
  Upload, 
  Thermometer, 
  Droplets, 
  Waves, 
  ChevronRight,
  CheckCircle2,
  X
} from "lucide-react";

const speciesOptions = ["Tilapia", "Catfish", "Trout", "Nile Perch"];
const ageOptions = ["Fingerlings", "Juvenile", "Mature"];
const symptomOptions = [
  "loss_of_appetite", "lethargy", "erratic_swimming", "isolation", 
  "surface_swimming", "gasping_for_air", "skin_lesions", "ulcers", 
  "fin_rot", "scale_loss", "body_swelling", "discoloration", 
  "eye_cloudiness", "excess_mucus", "gill_discoloration", 
  "rapid_gill_movement", "white_spots", "fungal_growth", "bloody_patches"
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
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const toggleSymptom = (symptom) => {
    setFormData((prev) => {
      const exists = prev.symptoms.includes(symptom);
      return {
        ...prev,
        symptoms: exists
          ? prev.symptoms.filter((s) => s !== symptom)
          : [...prev.symptoms, symptom],
      };
    });
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
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "symptoms") {
          value.forEach((s) => payload.append("symptoms", s));
        } else if (key === "recent_deaths") {
          payload.append(key, value ? 1 : 0);
        } else if (value !== null && value !== "") {
          payload.append(key, value);
        }
      });

      const res = await axios.post(`${API_URL}/ml/disease-detection/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (onResult) onResult(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700";
  const labelStyle = "block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl animate-shake">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* --- SECTION 1: CORE INFO --- */}
      <section>
        <div className="flex items-center gap-2 mb-6 text-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">1</div>
          <h3 className="font-bold text-lg">General Information</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Fish Species</label>
            <select name="species" value={formData.species} onChange={handleChange} className={inputStyle}>
              <option value="">Select Species</option>
              {speciesOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={labelStyle}>Age Group</label>
            <select name="age_group" value={formData.age_group} onChange={handleChange} className={inputStyle}>
              <option value="">Select Age</option>
              {ageOptions.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: ENVIRONMENT & STOCKING --- */}
      <section>
        <div className="flex items-center gap-2 mb-6 text-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">2</div>
          <h3 className="font-bold text-lg">Environment & Stocking</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Existing Water Params */}
          <div className="relative">
            <label className={labelStyle}>Temp (°C)</label>
            <div className="relative">
              <Thermometer className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input type="number" name="temperature" step="0.1" value={formData.temperature} onChange={handleChange} placeholder="27.0" className={`${inputStyle} pl-10`} />
            </div>
          </div>
          
          <div className="relative">
            <label className={labelStyle}>pH Level</label>
            <div className="relative">
              <Droplets className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input type="number" name="ph" step="0.1" value={formData.ph} onChange={handleChange} placeholder="7.0" className={`${inputStyle} pl-10`} />
            </div>
          </div>

          <div className="relative">
            <label className={labelStyle}>Water Source</label>
            <select name="water_source" value={formData.water_source} onChange={handleChange} className={inputStyle} required>
              <option value="">Select Source</option>
              <option value="pond">Pond</option>
              <option value="tank">Tank</option>
              <option value="cage">Cage</option>
            </select>
          </div>

          {/* Stocking Density */}
          <div className="relative">
            <label className={labelStyle}>Stocking Density</label>
            <div className="relative">
              <input type="number" name="stocking_density" value={formData.stocking_density} onChange={handleChange} placeholder="fish/pond" className={inputStyle} />
            </div>
          </div>

          {/* Oxygen (Moved here to fill the grid) */}
          <div className="relative">
            <label className={labelStyle}>Oxygen (mg/L)</label>
            <div className="relative">
              <Waves className="absolute left-3 top-3.5 text-slate-400" size={18} />
              <input type="number" name="oxygen" step="0.1" value={formData.oxygen} onChange={handleChange} placeholder="6.5" className={`${inputStyle} pl-10`} />
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: MORTALITY TRACKING --- */}
      <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${formData.recent_deaths ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Mortality Tracking</h4>
              <p className="text-xs text-slate-500">Have there been any recent losses?</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Modern Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="recent_deaths" 
                checked={formData.recent_deaths} 
                onChange={handleChange} 
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              <span className="ml-3 text-sm font-medium text-slate-700">Recent Deaths</span>
            </label>

            {/* Conditional Death Rate Input */}
            {formData.recent_deaths && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="relative">
                  <input 
                    type="number" 
                    name="death_rate" 
                    value={formData.death_rate} 
                    onChange={handleChange} 
                    placeholder="Death Rate %" 
                    className="bg-white border border-red-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500/20 w-32"
                    required={formData.recent_deaths}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- SECTION 3: SYMPTOMS --- */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">3</div>
          <h3 className="font-bold text-lg">Observed Symptoms</h3>
        </div>
        <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          {symptomOptions.map((symptom) => {
            const active = formData.symptoms.includes(symptom);
            return (
              <button
                type="button"
                key={symptom}
                onClick={() => toggleSymptom(symptom)}
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  active 
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200" 
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {active ? <CheckCircle2 size={14} /> : null}
                {symptom.replace(/_/g, " ")}
              </button>
            );
          })}
        </div>
      </section>

      {/* --- SECTION 4: MEDIA & SUBMIT --- */}
      <section className="pt-6 border-t border-slate-100">
          {/* <div 
            onClick={() => fileInputRef.current.click()}
            className="group cursor-pointer border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all rounded-3xl p-8 text-center"
          >
            <input type="file" ref={fileInputRef} name="image" onChange={handleChange} className="hidden" accept="image/*" />
            <div className="w-12 h-12 bg-slate-100 group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-slate-700">
              {formData.image ? formData.image.name : "Upload Symptom Image"}
            </p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Analyze Health <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
      </section>
    </form>
  );
};

export default DiseaseDetectionForm;