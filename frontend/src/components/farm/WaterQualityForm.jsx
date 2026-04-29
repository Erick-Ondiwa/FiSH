import React, { useState, useMemo } from "react";
import {
  Thermometer,
  Droplets,
  Activity,
  Save,
  AlertCircle,
  Clock,
} from "lucide-react";

const WaterQualityForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState({
    temperature: "",
    dissolved_oxygen: "",
    ph: "",
    measured_at: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // VALIDATION
  // -----------------------------
  const validation = useMemo(() => {
    const errs = {};

    const temp = Number(form.temperature);
    const oxygen = Number(form.dissolved_oxygen);
    const ph = Number(form.ph);

    if (!temp || temp < 0 || temp > 50) {
      errs.temperature = "Temperature must be between 0–50°C";
    }

    if (!oxygen || oxygen < 0 || oxygen > 20) {
      errs.dissolved_oxygen = "Oxygen must be between 0–20 mg/L";
    }

    if (!ph || ph < 0 || ph > 14) {
      errs.ph = "pH must be between 0–14";
    }

    return errs;
  }, [form]);

  const isValid = Object.keys(validation).length === 0;

  // -----------------------------
  // INSIGHTS
  // -----------------------------
  const insights = useMemo(() => {
    const temp = Number(form.temperature);
    const oxygen = Number(form.dissolved_oxygen);
    const ph = Number(form.ph);

    const messages = [];

    if (temp && (temp < 20 || temp > 32)) {
      messages.push("Temperature outside optimal range (20–32°C)");
    }

    if (oxygen && oxygen < 5) {
      messages.push("Low dissolved oxygen may stress fish");
    }

    if (ph && (ph < 6.5 || ph > 8.5)) {
      messages.push("pH may affect fish growth");
    }

    return messages;
  }, [form]);

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = () => {
    if (!isValid) {
      setErrors(validation);
      return;
    }

    setErrors({});

    onSubmit({
      temperature: Number(form.temperature),
      dissolved_oxygen: Number(form.dissolved_oxygen),
      ph: Number(form.ph),
      measured_at: form.measured_at || null,
    });

    // Reset after submit
    setForm({
      temperature: "",
      dissolved_oxygen: "",
      ph: "",
      measured_at: "",
    });
  };

  // -----------------------------
  // INPUT COMPONENT
  // -----------------------------
  const Input = ({ icon: Icon, label, name, unit, type = "number" }) => (
    <div className="space-y-1">
      <label className="text-xs text-slate-400">{label}</label>

      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
        <Icon size={14} />
        <input
          type={type}
          step="0.1"
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="w-full bg-transparent outline-none text-white text-sm"
        />
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>

      {errors[name] && (
        <p className="text-red-400 text-xs">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-6 text-white">
      <h2 className="text-lg font-semibold">Water Quality</h2>

      <div className="grid md:grid-cols-3 gap-4">
        <Input icon={Thermometer} label="Temperature" name="temperature" unit="°C" />
        <Input icon={Droplets} label="Oxygen" name="dissolved_oxygen" unit="mg/L" />
        <Input icon={Activity} label="pH" name="ph" />
      </div>

      {/* Timestamp */}
      <div className="space-y-1">
        <label className="text-xs text-slate-400">Measurement Time (optional)</label>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
          <Clock size={14} />
          <input
            type="datetime-local"
            name="measured_at"
            value={form.measured_at}
            onChange={handleChange}
            className="w-full bg-transparent outline-none text-white text-sm"
          />
        </div>
      </div>

      {/* INSIGHTS */}
      {insights.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
          {insights.map((msg, i) => (
            <p key={i} className="text-yellow-400 text-sm">
              ⚠ {msg}
            </p>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 font-semibold flex items-center justify-center gap-2"
      >
        <Save size={16} />
        {loading ? "Saving..." : "Save Water Data"}
      </button>
    </div>
  );
};

export default WaterQualityForm;