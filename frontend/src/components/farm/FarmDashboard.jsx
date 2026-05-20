import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../api";
import {
  Fish,
  AlertCircle,
  PlusCircle,
  Droplets,
  Activity,
} from "lucide-react";

import PondForm from "./PondForm";
import WaterQualityForm from "./WaterQualityForm";
import WaterQualityChart from "./WaterQualityChart";

const token = localStorage.getItem("access_token");

const FarmDashboard = () => {
  const [pond, setPond] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showPondForm, setShowPondForm] = useState(false);
  const [showWaterForm, setShowWaterForm] = useState(false);

  const [waterData, setWaterData] = useState([]);

  // ---------------- FETCH
  const fetchFarm = async () => {
    try {
      const res = await axios.get(`${API_URL}/farm/pond/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPond(res.data);
    } catch {
      setPond(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWater = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/farm/water-quality/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWaterData(res.data.reverse()); // oldest → newest
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFarm();
    fetchWater();
  }, []);

  // ---------------- SAVE POND
const handleSavePond = async (pondData) => {
  setSaving(true);

  try {
    let res;

    if (pond) {
      res = await axios.put(
        `${API_URL}/farm/pond/${pond.id}/`,
        pondData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      res = await axios.post(
        `${API_URL}/farm/pond/`,
        pondData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    // Update pond state
    setPond(res.data);

    // Close pond form
    setShowPondForm(false);

    // Automatically open water quality form
    setShowWaterForm(true);

  } catch (err) {
    console.error(err);
  } finally {
    setSaving(false);
  }
};

  // ---------------- SAVE WATER
  const handleSaveWater = async (data) => {
    setSaving(true);
    try {
      await axios.post(`${API_URL}/farm/water-quality/`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowWaterForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // ---------------- LOADING
  if (loading) {
    return <div className="p-6 text-slate-400">Loading farm data...</div>;
  }

  // ---------------- EMPTY STATE
  if (!pond && !showPondForm) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 text-center space-y-6 max-w-lg w-full shadow-xl">
          <Fish size={36} className="mx-auto text-teal-400" />
          <h2 className="text-xl font-semibold text-white">
            Setup Your Farm
          </h2>
          <p className="text-slate-400 text-sm">
            Configure your pond to unlock insights and smart tracking.
          </p>
          <button
            onClick={() => setShowPondForm(true)}
            className="w-full py-3 bg-teal-500 hover:bg-teal-600 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} />
            Setup Pond
          </button>
        </div>
      </div>
    );
  }

  // ---------------- FORM ONLY
  if (!pond && showPondForm) {
    return (
      <div className="p-6">
        <PondForm onSave={handleSavePond} loading={saving} />
      </div>
    );
  }

  // ---------------- MAIN DASHBOARD
  return (
    <div className="p-6 space-y-8 text-white">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Farm Dashboard</h1>
          <p className="text-slate-400 text-sm">
            Real-time farm monitoring & insights
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowPondForm((p) => !p)}
            className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm hover:bg-slate-700"
          >
            Update Pond
          </button>

          <button
            onClick={() => setShowWaterForm((p) => !p)}
            className="px-4 py-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 rounded-lg text-sm hover:bg-teal-500/20"
          >
            Log Water
          </button>
        </div>
      </div>

      {/* SUMMARY STRIP */}
      <div className="grid md:grid-cols-3 gap-4">
        <SummaryCard
          icon={Activity}
          title="Farm Health"
          value={`${pond.survival_rate?.toFixed(0) || 0}%`}
          highlight
        />
        <SummaryCard
          icon={Fish}
          title="Total Fish"
          value={pond.current_count}
        />
        <SummaryCard
          icon={Droplets}
          title="Biomass"
          value={`${pond.biomass || 0} g`}
        />
      </div>

      {/* CORE METRICS */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* <Card title="Species" value={pond.species} /> */}
        <Card title="Avg Weight" value={`${pond.current_avg_weight} g`} />
        <Card title="Survival Rate" value={`${pond.survival_rate?.toFixed(1)} %`} />
        <Card title="Age" value={`${pond.age_days || 0} days`} />
      </div>

      <WaterQualityChart data={waterData} />

      {/* WARNING */}
      {!pond.current_avg_weight && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded-xl">
          <AlertCircle size={18} />
          <p className="text-sm">
            Update pond data to unlock accurate insights.
          </p>
        </div>
      )}

      {/* FORMS */}
      {showPondForm && (
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
          <PondForm
            onSave={handleSavePond}
            loading={saving}
            initialData={pond}
          />
        </div>
      )}

      {showWaterForm && (
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl">
          <WaterQualityForm
            onSubmit={handleSaveWater}
            loading={saving}
          />
        </div>
      )}
    </div>
  );
};

// ---------------- CARDS
const Card = ({ title, value }) => (
  <div className="bg-slate-900 border border-slate-700 p-5 rounded-2xl hover:border-slate-500 transition">
    <p className="text-slate-400 text-sm">{title}</p>
    <p className="text-xl font-semibold mt-1">{value ?? "N/A"}</p>
  </div>
);

const SummaryCard = ({ icon: Icon, title, value, highlight }) => (
  <div
    className={`p-5 rounded-2xl border ${
      highlight
        ? "bg-teal-500/10 border-teal-500/30"
        : "bg-slate-900 border-slate-700"
    }`}
  >
    <div className="flex items-center gap-2 text-slate-400 text-sm">
      <Icon size={16} />
      {title}
    </div>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default FarmDashboard;