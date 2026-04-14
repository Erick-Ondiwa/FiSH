import React, { useEffect, useState } from "react";
import { Layers, Fish, Clock } from "lucide-react";
import { API_URL } from "../../../api";

const StepFarmingDetails = ({ formData, setFormData, errors }) => {
  const [farmingMethods, setFarmingMethods] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);

  // -------------------------
  // FETCH DATA
  // -------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [methodsRes, speciesRes, ageRes] = await Promise.all([
          fetch(`${API_URL}/core/farming-methods/`),
          fetch(`${API_URL}/core/fish-species/`),
          fetch(`${API_URL}/core/age-groups/`),
        ]);

        setFarmingMethods(await methodsRes.json());
        setSpeciesList(await speciesRes.json());
        setAgeGroups(await ageRes.json());
      } catch (err) {
        console.error("Failed to load farming data:", err);
      }
    };

    fetchData();
  }, []);

  // -------------------------
  // TOGGLE MULTI SPECIES ✅ FIXED
  // -------------------------
  const toggleSpecies = (id) => {
    const current = formData.fish_species || [];

    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];

    setFormData({ ...formData, fish_species: next });
  };

  // -------------------------
  // STYLES
  // -------------------------
  const section = "space-y-3";
  const label = "text-xs text-slate-400 uppercase tracking-wider";
  
  const pillBase =
    "px-4 py-2 rounded-lg text-sm border transition flex items-center gap-2";

  const activePill =
    "bg-teal-500 text-white border-teal-500";

  const inactivePill =
    "bg-slate-900 text-slate-300 border-slate-700 hover:border-teal-400";

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-white">
          Farming Details
        </h3>
        <p className="text-sm text-slate-400">
          Configure your farming setup and fish profile.
        </p>
      </div>

      <div className="space-y-6">

        {/* FARMING METHOD */}
        <div className={section}>
          <label className={label}>Place of Farming</label>

          <div className="flex flex-wrap gap-2">
            {farmingMethods.map((method) => {
              const active = formData.place_of_farming === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      place_of_farming: method.id,
                    })
                  }
                  className={`${pillBase} ${
                    active ? activePill : inactivePill
                  }`}
                >
                  <Layers size={14} />
                  {method.name}
                </button>
              );
            })}
          </div>

          {errors.place_of_farming && (
            <p className="text-xs text-red-400">
              {errors.place_of_farming}
            </p>
          )}
        </div>

        {/* SPECIES (MULTI-SELECT) */}
        <div className={section}>
          <label className={label}>Fish Species</label>

          <div className="flex flex-wrap gap-2">
            {speciesList.map((species) => {
              const active =
                (formData.fish_species || []).includes(species.id);

              return (
                <button
                  key={species.id}
                  type="button"
                  onClick={() => toggleSpecies(species.id)}
                  className={`${pillBase} ${
                    active ? activePill : inactivePill
                  }`}
                >
                  <Fish size={14} />
                  {species.name}
                </button>
              );
            })}
          </div>

          <p className="text-xs text-slate-500">
            Select one or more species.
          </p>

          {errors.fish_species && (
            <p className="text-xs text-red-400">
              {errors.fish_species}
            </p>
          )}
        </div>

        {/* AGE GROUP */}
        <div className={section}>
          <label className={label}>Fish Age Group</label>

          <div className="flex flex-wrap gap-2">
            {ageGroups.map((age) => {
              const active = formData.age_group === age.id;

              return (
                <button
                  key={age.id}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      age_group: age.id,
                    })
                  }
                  className={`${pillBase} ${
                    active ? activePill : inactivePill
                  }`}
                >
                  <Clock size={14} />
                  {age.name}
                </button>
              );
            })}
          </div>

          {errors.age_group && (
            <p className="text-xs text-red-400">
              {errors.age_group}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default StepFarmingDetails;