import React from "react";
import { User, Mail, Phone, Lock } from "lucide-react";

const StepPersonalDetails = ({ formData, setFormData, errors }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">Basic personal details</h3>
      <p className="text-sm text-gray-600">
        Please tell us about yourself.
      </p>

      <div className="grid gap-3">
        <label className="flex items-center space-x-3">
          <User className="text-blue-500" />
          <input
            type="text"
            placeholder="Full name"
            value={formData.ful_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none"
          />
        </label>
        {errors.full_name && <p className="text-xs text-red-400">{errors.full_name}</p>}

        <label className="flex items-center space-x-3">
          <Mail className="text-blue-500" />
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none"
          />
        </label>
        {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}

        <label className="flex items-center space-x-3">
          <Phone className="text-blue-500" />
          <input
            type="tel"
            placeholder="Phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none"
          />
        </label>
        {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}

        <label className="flex items-center space-x-3">
          <Lock className="text-blue-500" />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none"
          />
        </label>
        {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
      </div>
    </div>
  );
};

export default StepPersonalDetails;
