import React from "react";
import { MapPin } from "lucide-react";

const StepLocationDetails = ({ formData, setFormData, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">Location details</h3>
      <p className="text-sm text-gray-600">
        Please tell us your location details.
      </p>

      <div className="grid gap-3">
        <label className="flex items-center space-x-3">
          {/* <MapPin className="text-blue-500" /> */}
          <input
            type="text"
            placeholder="County / Region"
            value={formData.county}
            onChange={(e) => setFormData({ ...formData, county: e.target.value })}
            className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none"
          />
        </label>
        {errors.county && <p className="text-xs text-red-400">{errors.county}</p>}

        <input
          type="text"
          placeholder="Subcounty / Ward (optional)"
          value={formData.subcounty}
          onChange={(e) => setFormData({ ...formData, subcounty: e.target.value })}
          className="bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none"
        />
      </div>
    </div>
  );
};

export default StepLocationDetails;
