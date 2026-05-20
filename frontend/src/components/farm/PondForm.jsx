import React, { useState, useMemo } from "react";
import {
  Fish,
  Scale,
  Layers,
  Calendar,
  Save,
  Ruler,
  Box,
} from "lucide-react";

const PondForm = ({ onSave, loading, initialData = {} }) => {
  const [form, setForm] = useState({
    species: initialData.species || "tilapia",
    age_group: initialData.age_group || "fingerlings",

    // Dimensions
    length: initialData.length || "",
    width: initialData.width || "",
    depth: initialData.depth || "",

    // Stocking
    stocking_date: initialData.stocking_date || "",
    initial_count: initialData.initial_count || "",
    initial_avg_weight: initialData.initial_avg_weight || "",

    // Current state
    current_count: initialData.current_count || "",
    current_avg_weight: initialData.current_avg_weight || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -----------------------------
  // VALIDATION
  // -----------------------------
  const isValid = useMemo(() => {
    return (
      Number(form.length) > 0 &&
      Number(form.width) > 0 &&
      Number(form.depth) > 0 &&
      form.stocking_date &&
      Number(form.initial_count) > 0 &&
      Number(form.current_count) > 0 &&
      Number(form.initial_avg_weight) > 0 &&
      Number(form.current_avg_weight) > 0
    );
  }, [form]);

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const handleSubmit = () => {
    if (!isValid) return;

    const payload = {
      species: form.species,
      age_group: form.age_group,
      length: Number(form.length),
      width: Number(form.width),
      depth: Number(form.depth),
      stocking_date: form.stocking_date,
      initial_count: Number(form.initial_count),
      current_count: Number(form.current_count),
      initial_avg_weight: Number(form.initial_avg_weight),
      current_avg_weight: Number(form.current_avg_weight),
    };

    onSave(payload);
  };

  // -----------------------------
  // INPUT COMPONENT
  // -----------------------------
  const Input = ({ icon: Icon, label, name, unit, type = "number" }) => (
    <div className="space-y-2">
      <label className="text-xs text-slate-400">{label}</label>

      <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
        <Icon size={14} className="text-slate-400" />
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          className="w-full bg-transparent outline-none text-sm text-white"
        />
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-8 text-white">
      <h2 className="text-xl font-semibold">Pond Setup</h2>

      {/* Species */}
      <select
        name="species"
        value={form.species}
        onChange={handleChange}
        className="w-full bg-slate-800 p-2 rounded-lg"
      >
        <option value="tilapia">Tilapia</option>
        <option value="catfish">Catfish</option>
      </select>

      <select
        name="age group"
        value={form.age_group}
        onChange={handleChange}
        className="w-full bg-slate-800 p-2 rounded-lg"
      >
        <option value="tilapia">Fingerlings</option>
        <option value="catfish">Juvenille</option>
      </select>


      {/* ----------------------------- */}
      {/* POND DIMENSIONS */}
      {/* ----------------------------- */}
      <div>
        <h3 className="text-sm text-slate-400 mb-3">Pond Dimensions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Input icon={Ruler} label="Length" name="length" unit="m" />
          <Input icon={Ruler} label="Width" name="width" unit="m" />
          <Input icon={Box} label="Depth" name="depth" unit="m" />
        </div>
      </div>

      {/* ----------------------------- */}
      {/* STOCKING INFO */}
      {/* ----------------------------- */}
      <div>
        <h3 className="text-sm text-slate-400 mb-3">Stocking Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            icon={Calendar}
            label="Stocking Date"
            name="stocking_date"
            type="date"
          />
          <Input icon={Fish} label="Initial Count" name="initial_count" />
          <Input
            icon={Scale}
            label="Initial Avg Weight"
            name="initial_avg_weight"
            unit="g"
          />
        </div>
      </div>

      {/* ----------------------------- */}
      {/* CURRENT STATUS */}
      {/* ----------------------------- */}
      <div>
        <h3 className="text-sm text-slate-400 mb-3">Current Status</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input icon={Fish} label="Current Count" name="current_count" />
          <Input
            icon={Scale}
            label="Current Avg Weight"
            name="current_avg_weight"
            unit="g"
          />
        </div>
      </div>

      {/* ----------------------------- */}
      {/* SUBMIT */}
      {/* ----------------------------- */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-600 transition font-semibold flex items-center justify-center gap-2"
      >
        <Save size={16} />
        {loading ? "Saving..." : "Save Pond"}
      </button>
    </div>
  );
};

export default PondForm;