import React from "react";

const ReviewRow = ({ label, value }) => (
  <div className="flex border-b border-white/10 py-2">
   <div className="text-sm text-black font-bold mr-5">{label}:</div>
    <div className="text-sm text-black-600">{value || "—"}</div>
  </div>
);

const StepReview = ({ formData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">Confirm & Review</h3>
      <p className="text-sm text-gray-600">
        Review your details. You can go back and edit any section before completing registration.
      </p>

      <div className="bg-blue/5 rounded-xl p-4">
        <ReviewRow label="Full name" value={formData.full_name} />
        <ReviewRow label="Email" value={formData.email} />
        <ReviewRow label="Phone" value={formData.phone} />
        <ReviewRow label="County" value={formData.county} />
        <ReviewRow label="Subcounty" value={formData.subcounty} />
        <ReviewRow label="Place of farming" value={formData.place_of_farming} />
        <ReviewRow label="Species" value={formData.fish_species.join(", ")} />
        <ReviewRow label="Age group" value={formData.age_group} />
      </div>

      <div className="flex items-center space-x-3">
        <input id="confirm" type="checkbox" className="accent-blue-500" />
        <label htmlFor="confirm" className="text-sm text-black-600">
          I confirm that the details above are correct.
        </label>
      </div>
    </div>
  );
};

export default StepReview;
