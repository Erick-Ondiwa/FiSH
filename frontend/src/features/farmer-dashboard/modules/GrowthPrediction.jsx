import React, { useState } from "react";
import axios from "axios";
import { Activity, TrendingUp } from "lucide-react";

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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = Object.values(formData).every((v) => v !== "");

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

      const res = await axios.post(
        "http://localhost:8000/api/ml/predict-growth/",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setPrediction(res.data.predicted_weight);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------
  // STYLES
  // -----------------------
  const input =
    "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40";

  const label = "text-xs text-slate-400 mb-1 block";

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-8">

        {/* FORM */}
        <div className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-teal-400" />
            <h2 className="text-lg font-semibold text-white">
              Growth Prediction
            </h2>
          </div>

          <form onSubmit={handlePredict} className="space-y-5">

            <div>
              <label className={label}>Species</label>
              <select
                name="species"
                value={formData.species}
                onChange={handleChange}
                className={input}
              >
                <option>Tilapia</option>
                <option>Catfish</option>
                <option>Trout</option>
                <option>Nile Perch</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={label}>Initial Weight (g)</label>
                <input name="initial_weight" type="number" onChange={handleChange} className={input} />
              </div>

              <div>
                <label className={label}>Days</label>
                <input name="days" type="number" onChange={handleChange} className={input} />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <input name="temperature" placeholder="Temperature °C" onChange={handleChange} className={input} />
              <input name="ph" placeholder="pH" onChange={handleChange} className={input} />
              <input name="oxygen" placeholder="Oxygen mg/L" onChange={handleChange} className={input} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input name="density" placeholder="Density" onChange={handleChange} className={input} />
              <input name="feeding_rate" placeholder="Feeding Rate %" onChange={handleChange} className={input} />
            </div>

            <button
              disabled={!isFormValid || loading}
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-white rounded-lg font-semibold transition disabled:opacity-40"
            >
              {loading ? "Processing..." : "Predict Growth"}
            </button>
          </form>
        </div>

        {/* RESULT PANEL */}
        <div className="lg:col-span-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 h-full flex flex-col justify-center items-center text-center">

            {prediction ? (
              <>
                <p className="text-sm text-slate-400 mb-2">
                  Predicted Weight
                </p>

                <h2 className="text-4xl font-bold text-teal-400">
                  {prediction.toFixed(1)} g
                </h2>

                <div className="mt-6 w-full text-sm text-slate-400 space-y-2">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>{formData.days} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth</span>
                    <span>
                      +{(prediction - formData.initial_weight).toFixed(1)} g
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Activity size={40} className="text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">
                  Enter parameters to generate prediction
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthPrediction;