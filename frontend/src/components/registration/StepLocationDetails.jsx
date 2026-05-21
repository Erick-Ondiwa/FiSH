import React, { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { API_URL } from "../../api";

const StepLocationDetails = ({ formData, setFormData, errors }) => {
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [loadingCounties, setLoadingCounties] = useState(true);
  const [loadingSubcounties, setLoadingSubcounties] = useState(false);

  // -------------------------
  // FETCH COUNTIES
  // -------------------------
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const res = await fetch(`${API_URL}/core/counties/`);
        const data = await res.json();
        setCounties(data);
      } catch (err) {
        console.error("Failed to fetch counties:", err);
      } finally {
        setLoadingCounties(false);
      }
    };

    fetchCounties();
  }, []);

  // -------------------------
  // FETCH SUBCOUNTIES
  // -------------------------
  useEffect(() => {
    if (!formData.county) {
      setSubcounties([]);
      return;
    }

    const fetchSubcounties = async () => {
      setLoadingSubcounties(true);
      try {
        const res = await fetch(
          `${API_URL}/core/subcounties/?county=${formData.county}`
        );
        const data = await res.json();
        setSubcounties(data);
      } catch (err) {
        console.error("Failed to fetch subcounties:", err);
      } finally {
        setLoadingSubcounties(false);
      }
    };

    fetchSubcounties();
  }, [formData.county]);

  // -------------------------
  // STYLES
  // -------------------------
  const input =
    "w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/40";

  const label = "text-xs text-slate-400 mb-1 block";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-white">
          Location Details
        </h3>
        <p className="text-sm text-slate-400">
          Where is your farm located?
        </p>
      </div>

      <div className="grid gap-5">

        {/* COUNTY */}
        <div className="space-y-1">
          <label className={label}>County</label>
          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={formData.county || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  county: Number(e.target.value),
                  subcounty: "",
                })
              }
              className={`${input} pl-9`}
            >
              <option value="">
                {loadingCounties ? "Loading counties..." : "Select County"}
              </option>

              {counties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
          </div>

          {errors.county && (
            <p className="text-xs text-red-400">{errors.county}</p>
          )}
        </div>

        {/* SUBCOUNTY */}
        <div className="space-y-1">
          <label className={label}>Subcounty</label>

          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <select
              value={formData.subcounty || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  subcounty: Number(e.target.value),
                })
              }
              disabled={!formData.county || loadingSubcounties}
              className={`${input} pl-9 disabled:opacity-50`}
            >
              <option value="">
                {!formData.county
                  ? "Select county first"
                  : loadingSubcounties
                  ? "Loading subcounties..."
                  : "Select Subcounty"}
              </option>

              {subcounties.map((subcounty) => (
                <option key={subcounty.id} value={subcounty.id}>
                  {subcounty.name}
                </option>
              ))}
            </select>
          </div>

          {errors.subcounty && (
            <p className="text-xs text-red-400">
              {errors.subcounty}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default StepLocationDetails;