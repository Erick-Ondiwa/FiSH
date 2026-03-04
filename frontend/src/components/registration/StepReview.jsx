import React, { useEffect, useState } from "react";

import { API_URL } from "../../../api";

const ReviewRow = ({ label, value }) => (
  <div className="flex border-b border-white/10 py-2">
    <div className="text-sm text-black font-bold mr-5">
      {label}:
    </div>
    <div className="text-sm text-black">
      {value || "—"}
    </div>
  </div>
);

const StepReview = ({ formData }) => {
  const [lookups, setLookups] = useState({
    counties: [],
    subcounties: [],
    farmingMethods: [],
    species: [],
    ageGroups: [],
  });

  // Fetch lookup data once
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [
          countiesRes,
          subcountiesRes,
          methodsRes,
          speciesRes,
          ageRes,
        ] = await Promise.all([
          fetch(`${API_URL}/core/counties/`),
          fetch(`${API_URL}/core/subcounties/`),
          fetch(`${API_URL}/core/farming-methods/`),
          fetch(`${API_URL}/core/fish-species/`),
          fetch(`${API_URL}/core/age-groups/`),
        ]);

        setLookups({
          counties: await countiesRes.json(),
          subcounties: await subcountiesRes.json(),
          farmingMethods: await methodsRes.json(),
          species: await speciesRes.json(),
          ageGroups: await ageRes.json(),
        });
      } catch (err) {
        console.error("Failed to fetch review lookups:", err);
      }
    };

    fetchLookups();
  }, []);

  // Helper to resolve ID → name
  const resolveName = (list, id) =>
    list.find((item) => item.id === id)?.name || "—";

  // const resolveSpeciesNames = () => {
  //   if (!formData.fish_species?.length) return "—";

  //   return formData.fish_species
  //     .map(
  //       (id) =>
  //         lookups.species.find((s) => s.id === id)?.name
  //     )
  //     .filter(Boolean)
  //     .join(", ");
  // };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">
        Confirm & Review
      </h3>

      <p className="text-sm text-gray-600">
        Review your details. You can go back and edit any section before completing registration.
      </p>

      <div className="bg-blue/5 rounded-xl p-4">

        <ReviewRow label="Full name" value={formData.full_name} />
        <ReviewRow label="Email" value={formData.email} />
        <ReviewRow label="Phone" value={formData.phone} />

        <ReviewRow
          label="County"
          value={resolveName(lookups.counties, formData.county)}
        />

        <ReviewRow
          label="Subcounty"
          value={resolveName(lookups.subcounties, formData.subcounty)}
        />

        <ReviewRow
          label="Place of farming"
          value={resolveName(
            lookups.farmingMethods,
            formData.place_of_farming
          )}
        />

        <ReviewRow
          label="Species"
          value={resolveName(
            lookups.species,
            formData.fish_species
          )}
        />

        <ReviewRow
          label="Age group"
          value={resolveName(
            lookups.ageGroups,
            formData.age_group
          )}
        />

      </div>

      <div className="flex items-center space-x-3">
        <input
          id="confirm"
          type="checkbox"
          className="accent-blue-500"
        />
        <label htmlFor="confirm" className="text-sm text-black">
          I confirm that the details above are correct.
        </label>
      </div>
    </div>
  );
};

export default StepReview;
