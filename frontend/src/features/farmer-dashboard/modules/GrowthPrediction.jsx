import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Thermometer, Droplets, Wind, Zap, Activity, Info, Target, TrendingUp } from "lucide-react";

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
    } finally {
      setLoading(false);
    }
  };

  // --- BRANDED STYLES ---
  const inputStyle =
    "w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-blue-900 placeholder:text-slate-400 font-medium";

  const labelStyle =
    "flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-900/60 mb-2 ml-1";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-8">
          <form
            onSubmit={handlePredict}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-blue-900">Growth Projection</h2>
                <p className="text-sm text-slate-500">ML-Powered weight estimation based on environment</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              {/* Species Selection */}
              <div className="md:col-span-2">
                <label className={labelStyle}>Selected Species</label>
                <div className="relative">
                  <select name="species" value={formData.species} onChange={handleChange} className={`${inputStyle} appearance-none cursor-pointer`}>
                    <option>Tilapia</option>
                    <option>Trout</option>
                    <option>Catfish</option>
                    <option>Nile Perch</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <Activity size={18} />
                  </div>
                </div>
              </div>

              {/* Weight & Duration */}
              <div className="space-y-6">
                <div>
                  <label className={labelStyle}><Scale size={14} /> Initial Weight (g)</label>
                  <input type="number" name="initial_weight" value={formData.initial_weight} onChange={handleChange} placeholder="0.00" className={inputStyle} required />
                </div>
                <div>
                  <label className={labelStyle}><Zap size={14} /> Forecast Period (Days)</label>
                  <input type="number" name="days" value={formData.days} onChange={handleChange} placeholder="60" className={inputStyle} required />
                </div>
              </div>

              {/* Environment Parameters */}
              <div className="bg-slate-50/50 p-6 rounded-[2rem] space-y-6 border border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyle}><Thermometer size={14} /> Temp</label>
                    <input type="number" step="0.1" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="26°" className={inputStyle} required />
                  </div>
                  <div>
                    <label className={labelStyle}><Droplets size={14} /> pH</label>
                    <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} placeholder="7.0" className={inputStyle} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className={labelStyle}><Wind size={14} /> Oxygen</label>
                    <input type="number" step="0.1" name="oxygen" value={formData.oxygen} onChange={handleChange} placeholder="6.2" className={inputStyle} required />
                  </div>
                  <div>
                    <label className={labelStyle}><Info size={14} /> Density</label>
                    <input type="number" name="density" value={formData.density} onChange={handleChange} placeholder="15" className={inputStyle} required />
                  </div>
                </div>
              </div>

              {/* Feeding Rate */}
              <div className="md:col-span-2">
                <label className={labelStyle}>Daily Feeding Rate (% of biomass)</label>
                <input type="number" step="0.1" name="feeding_rate" value={formData.feeding_rate} onChange={handleChange} placeholder="3.5" className={inputStyle} required />
              </div>
            </div>

            <button
              disabled={loading || !isFormValid}
              className="w-full mt-10 bg-blue-900 hover:bg-blue-800 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3 tracking-wide"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Metrics...
                </>
              ) : "Calculate Growth Projection"}
            </button>
          </form>
        </div>

        {/* Right Column: Dynamic Result Panel */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-700 to-teal-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden flex flex-col items-center justify-center text-center">
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400/20 rounded-full blur-2xl" />

            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10"
                >
                  <div className="inline-flex p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-6">
                    <Target size={32} className="text-teal-300" />
                  </div>
                  <p className="text-teal-100 font-black uppercase tracking-[0.2em] text-[10px] mb-4">
                    Predicted Target Weight
                  </p>
                  <h2 className="text-7xl font-black tracking-tighter drop-shadow-lg">
                    {prediction.toFixed(1)}<span className="text-3xl ml-1 text-teal-200">g</span>
                  </h2>
                  <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-100/60">Duration</span>
                      <span className="font-bold">{formData.days} Days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-teal-100/60">Total Increase</span>
                      <span className="font-bold">+{ (prediction - formData.initial_weight).toFixed(1) }g</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 space-y-4"
                >
                  <Activity size={48} className="mx-auto text-white/20 animate-pulse" />
                  <p className="text-blue-100/50 text-sm font-medium max-w-[180px] mx-auto leading-relaxed">
                    Awaiting environmental input for real-time calculation...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Massive Icon Overlay */}
            <TrendingUp 
              size={300} 
              className="absolute -bottom-16 -right-16 text-white/[0.03] rotate-[-15deg] pointer-events-none" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthPrediction;