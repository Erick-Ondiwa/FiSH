import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { API_URL } from "../../../api";

const ReviewRow = ({ label, value }) => (
  <div className="flex justify-between items-start border-b border-slate-700 py-3">
    <span className="text-sm text-slate-400">{label}</span>
    <span className="text-sm text-white text-right max-w-[60%]">
      {value || "—"}
    </span>
  </div>
);

const StepReview = ({ formData, onComplete, submitting }) => {
  const [lookups, setLookups] = useState({
    counties: [],
    subcounties: [],
    farmingMethods: [],
    species: [],
    ageGroups: [],
  });

  const [confirmed, setConfirmed] = useState(false);

  // -------------------------
  // FETCH LOOKUPS
  // -------------------------
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

  const handleComplete = () => {
    if (!confirmed) return;
    onComplete(); // triggers Step 4 API
  };

  // -------------------------
  // HELPERS
  // -------------------------
  const resolveName = (list, id) =>
    list.find((item) => item.id === id)?.name || "—";

  // ✅ FIXED MULTI-SPECIES DISPLAY
  const resolveSpeciesName = () => {
    if (!formData.fish_species) return "—";

    return (
      lookups.species.find(
        (s) => s.id === formData.fish_species
      )?.name || "—"
    );
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      
      {/* HEADER (fixed) */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">
          Review & Confirm
        </h3>
        <p className="text-sm text-slate-400">
          Verify your details before completing registration.
        </p>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6">

        {/* REVIEW CARD */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-1">
          <ReviewRow label="Full Name" value={formData.full_name} />
          <ReviewRow label="Email" value={formData.email} />
          <ReviewRow label="Phone" value={formData.phone} />

          <ReviewRow
            label="County"
            value={resolveName(lookups.counties, formData.county)}
          />

          <ReviewRow
            label="Subcounty"
            value={resolveName(
              lookups.subcounties,
              formData.subcounty
            )}
          />

          <ReviewRow
            label="Farming Method"
            value={resolveName(
              lookups.farmingMethods,
              formData.place_of_farming
            )}
          />

          <ReviewRow
            label="Fish Species"
            value={resolveSpeciesName()}
          />

          <ReviewRow
            label="Age Group"
            value={resolveName(
              lookups.ageGroups,
              formData.age_group
            )}
          />
        </div>

        {/* CONFIRMATION */}
        <div className="flex items-start gap-3 bg-slate-900 border border-slate-700 rounded-lg p-4">
          <input
            id="confirm"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
            className="mt-1 accent-teal-500"
          />

          <label
            htmlFor="confirm"
            className="text-sm text-slate-300 cursor-pointer"
          >
            I confirm that the information provided is accurate and complete.
          </label>
        </div>

        {/* SUCCESS */}
        {confirmed && (
          <div className="flex items-center gap-2 text-teal-400 text-sm">
            <CheckCircle2 size={16} />
            Ready to complete registration
          </div>
        )}

      </div>
    </div>
  );
};

export default StepReview;