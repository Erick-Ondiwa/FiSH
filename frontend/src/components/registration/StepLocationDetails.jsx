import React, { useEffect, useState } from "react";

import { API_URL } from "../../../api";

const StepLocationDetails = ({ formData, setFormData, errors }) => {
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [loadingCounties, setLoadingCounties] = useState(true);
  const [loadingSubcounties, setLoadingSubcounties] = useState(false);

  // Fetch counties on mount
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

  // Fetch subcounties when county changes
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">
        Location Details
      </h3>

      {/* County Dropdown */}
      <div>
        <select
          value={formData.county || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              county: Number(e.target.value),
              subcounty: "",
            })
          }
          className="w-full bg-white border px-4 py-2 rounded-lg"
        >
          <option value="">Select County</option>
          {loadingCounties && <option>Loading...</option>}
          {counties.map((county) => (
            <option key={county.id} value={county.id}>
              {county.name}
            </option>
          ))}
        </select>
        {errors.county && (
          <p className="text-xs text-red-500 mt-1">{errors.county}</p>
        )}
      </div>

      {/* Subcounty Dropdown */}
      <div>
        <select
          value={formData.subcounty || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              subcounty: Number(e.target.value),
            })
          }
          disabled={!formData.county}
          className="w-full bg-white border px-4 py-2 rounded-lg"
        >
          <option value="">Select Subcounty</option>
          {loadingSubcounties && <option>Loading...</option>}
          {subcounties.map((subcounty) => (
            <option key={subcounty.id} value={subcounty.id}>
              {subcounty.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StepLocationDetails;
