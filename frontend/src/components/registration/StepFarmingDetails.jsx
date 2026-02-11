import React from "react";
import { MapPin, Fish } from "lucide-react";
const speciesOptions = ["Tilapia", "Catfish", "Trout", "Nile Perch", "Other"];
const placeOptions = ["Pond", "Lake", "Cage", "Other"];
const ageOptions = ["Fingerlings", "Juvenile", "Matured Fish"];

const StepFarmingDetails = ({ formData, setFormData, errors }) => {
  const toggleSpecies = (s) => {
    const next = formData.fish_species.includes(s)
      ? formData.fish_species.filter((x) => x !== s)
      : [...formData.fish_species, s];
    setFormData({ ...formData, fish_species: next });
  };
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">Farming details</h3>
      <p className="text-sm text-gray-600">
        Tell us where and what you plan to farm so we can recommend tailored resources.
      </p>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Place of farming</label>
          <div className="flex flex-wrap gap-3">
            {placeOptions.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFormData({ ...formData, place_of_farming: p })}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  formData.place_of_farming === p
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white/40 text-blue-800 border-white/30"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          {errors.place_of_farming && <p className="text-xs text-red-400">{errors.place_of_farming}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fish species</label>
          <div className="flex flex-wrap gap-3">
            {speciesOptions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpecies(s)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  formData.fish_species.includes(s)
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white/40 text-blue-800 border-white/30"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <small className="text-xs text-gray-500">Choose one or more species.</small>
          {errors.fish_species && <p className="text-xs text-red-400">{errors.fish_species}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Age group</label>
          <div className="flex flex-wrap gap-3">
            {ageOptions.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setFormData({ ...formData, age_group: a })}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  formData.age_group === a
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white/40 text-blue-800 border-white/30"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          {errors.age_group && <p className="text-xs text-red-400">{errors.age_group}</p>}
        </div>
      </div>
    </div>
  );
};

export default StepFarmingDetails;
