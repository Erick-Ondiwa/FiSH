import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";

const StepPersonalDetails = ({ formData, setFormData, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-blue-900">Basic personal details</h3>
      <p className="text-sm text-gray-600">Please tell us about yourself.</p>

      <div className="grid gap-3">
        {/* Full Name */}
        <label className="flex items-center space-x-3">
          <User className="text-blue-500" />
          <input
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none"
          />
        </label>
        {errors.full_name && <p className="text-xs text-red-400">{errors.full_name}</p>}

        {/* Email */}
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

        {/* Phone */}
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

        {/* Password */}
        <div className="relative flex items-center space-x-3">
          <Lock className="text-blue-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none pr-10"
          />
          <button
            type="button"
            className="absolute right-3 text-gray-400 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}

        {/* Confirm Password */}
        <div className="relative flex items-center space-x-3">
          <Lock className="text-blue-500" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="flex-1 bg-white/60 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-lg focus:outline-none pr-10"
          />
          <button
            type="button"
            className="absolute right-3 text-gray-400 hover:text-gray-700"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword}</p>}
      </div>
    </div>
  );
};

export default StepPersonalDetails;
