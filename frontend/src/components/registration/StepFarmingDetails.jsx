import React, { useEffect, useState } from "react";

import { API_URL } from "../../../api";

const StepFarmingDetails = ({ formData, setFormData, errors }) => {
  const [farmingMethods, setFarmingMethods] = useState([]);
  const [speciesList, setSpeciesList] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);

  // Fetch all lookup data on mount
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

  // Toggle species (many-to-many IDs)
  const toggleSpecies = (id) => {
    const current = formData.fish_species || [];

    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];

    setFormData({ ...formData, fish_species: next });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">
        Farming Details
      </h3>

      <div className="grid gap-4">

        {/* Farming Method */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Place of farming
          </label>
          <div className="flex flex-wrap gap-3">
            {farmingMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    place_of_farming: method.id,
                  })
                }
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  formData.place_of_farming === method.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-800 border-gray-300"
                }`}
              >
                {method.name}
              </button>
            ))}
          </div>
          {errors.place_of_farming && (
            <p className="text-xs text-red-500 mt-1">
              {errors.place_of_farming}
            </p>
          )}
        </div>

        {/* Fish Species (Multi-select) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Fish Species
          </label>
          <div className="flex flex-wrap gap-3">
            {speciesList.map((species) => (
              <button
                key={species.id}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    fish_species: species.id,
                  })
                }
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  formData.fish_species === species.id
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-blue-800 border-gray-300"
                }`}
              >
                {species.name}
              </button>
            ))}
          </div>
          <small className="text-xs text-gray-500">
            Choose one or more species.
          </small>
          {errors.fish_species && (
            <p className="text-xs text-red-500 mt-1">
              {errors.fish_species}
            </p>
          )}
        </div>

        {/* Age Group */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Age Group
          </label>
          <div className="flex flex-wrap gap-3">
            {ageGroups.map((age) => (
              <button
                key={age.id}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    age_group: age.id,
                  })
                }
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  formData.age_group === age.id
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-800 border-gray-300"
                }`}
              >
                {age.name}
              </button>
            ))}
          </div>
          {errors.age_group && (
            <p className="text-xs text-red-500 mt-1">
              {errors.age_group}
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default StepFarmingDetails;
