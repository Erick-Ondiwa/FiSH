import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Scale, Thermometer, Droplets, Wind, Zap, Activity, Info } from "lucide-react";

const GrowthPrediction = () => {
  const [formData, setFormData] = useState({
    species: "Tilapia",
    initial_weight: "",
    days: "",
    temperature: "",
    oxygen: "",
    ph: "",
    density: "",
    feeding_rate: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isFormValid = Object.values(formData).every((val) => val !== "");

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const payload = {
        Species: formData.species,
        initial_weight: parseFloat(formData.initial_weight),
        days: parseInt(formData.days),
        temperature: parseFloat(formData.temperature),
        oxygen: parseFloat(formData.oxygen),
        ph: parseFloat(formData.ph),
        density: parseFloat(formData.density),
        feeding_rate: parseFloat(formData.feeding_rate),
      };

      const response = await axios.post(
        "http://localhost:8000/api/ml/predict-growth/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setPrediction(response.data.predicted_weight);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Prediction failed. Ensure backend is running and inputs are valid.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle =
    "w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-slate-700";

  const labelStyle =
    "flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 ml-1";

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Input Form */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handlePredict}
            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
          >
            <div className="grid md:grid-cols-2 gap-6">

              {/* Species */}
              <div className="md:col-span-2">
                <label className={labelStyle}>
                  <Activity size={16} className="text-teal-500" />
                  Select Fish Species
                </label>
                <select
                  name="species"
                  value={formData.species}
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option>Tilapia</option>
                  <option>Trout</option>
                  <option>Catfish</option>
                  <option>Nile Perch</option>
                </select>
              </div>

              {/* Initial Weight */}
              <div>
                <label className={labelStyle}>
                  <Scale size={16} className="text-teal-500" />
                  Initial Weight (g)
                </label>
                <input
                  type="number"
                  name="initial_weight"
                  value={formData.initial_weight}
                  onChange={handleChange}
                  placeholder="e.g. 25.5"
                  className={inputStyle}
                  required
                />
              </div>

              {/* Days */}
              <div>
                <label className={labelStyle}>
                  <Zap size={16} className="text-teal-500" />
                  Duration (Days)
                </label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleChange}
                  placeholder="e.g. 60"
                  className={inputStyle}
                  required
                />
              </div>

              {/* Temperature */}
              <div>
                <label className={labelStyle}>
                  <Thermometer size={16} className="text-orange-400" />
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  placeholder="26.5"
                  className={inputStyle}
                  required
                />
              </div>

              {/* Oxygen */}
              <div>
                <label className={labelStyle}>
                  <Wind size={16} className="text-blue-400" />
                  Dissolved Oxygen
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="oxygen"
                  value={formData.oxygen}
                  onChange={handleChange}
                  placeholder="6.2"
                  className={inputStyle}
                  required
                />
              </div>

              {/* pH */}
              <div>
                <label className={labelStyle}>
                  <Droplets size={16} className="text-teal-400" />
                  pH Level
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="ph"
                  value={formData.ph}
                  onChange={handleChange}
                  placeholder="7.0"
                  className={inputStyle}
                  required
                />
              </div>

              {/* Density */}
              <div>
                <label className={labelStyle}>
                  <Info size={16} className="text-slate-400" />
                  Stocking Density
                </label>
                <input
                  type="number"
                  name="density"
                  value={formData.density}
                  onChange={handleChange}
                  placeholder="15"
                  className={inputStyle}
                  required
                />
              </div>

              {/* Feeding Rate (FIXED) */}
              <div className="md:col-span-2">
                <label className={labelStyle}>
                  <Info size={16} className="text-green-500" />
                  Feeding Rate (% body weight/day)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="feeding_rate"
                  value={formData.feeding_rate}
                  onChange={handleChange}
                  placeholder="e.g. 3.5"
                  className={inputStyle}
                  required
                />
              </div>
            </div>

            <button
              disabled={loading || !isFormValid}
              className="w-full mt-8 bg-slate-900 hover:bg-teal-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? "Analyzing Environment..." : "Predict Target Weight"}
            </button>
          </form>
        </div>

        {/* Result Panel */}
        <div className="space-y-6">
          <div className="bg-teal-500 rounded-3xl p-8 text-white shadow-xl shadow-teal-100 relative overflow-hidden h-full min-h-[300px] flex flex-col justify-center">
            <div className="relative z-10 text-center">
              <p className="text-teal-100 font-bold uppercase tracking-widest text-xs mb-2">
                Estimated Result
              </p>

              {prediction ? (
                <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                  <h2 className="text-6xl font-black">
                    {prediction.toFixed(2)}g
                  </h2>
                  <p className="mt-4 text-teal-50 text-sm leading-relaxed">
                    Your {formData.species} are expected to reach this weight in{" "}
                    {formData.days} days.
                  </p>
                </motion.div>
              ) : (
                <div className="opacity-60 italic">
                  Fill the form to see growth prediction
                </div>
              )}
            </div>

            <Activity
              size={200}
              className="absolute -bottom-10 -right-10 text-teal-400/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthPrediction;