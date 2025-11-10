import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fish, X } from "lucide-react"; // X for close

import { API_URL } from "../../api";

const LoginModal = ({ isOpen, onClose, onLoginSuccess, onRegister }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || data.error || "Login failed");

      onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-900/40 via-blue-700/30 to-teal-600/20 backdrop-blur-md z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="relative z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl w-[90%] max-w-md p-8 overflow-hidden">
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-red-400 transition z-50 cursor-pointer"
              >
                <X size={24} />
              </button>
              {/* Floating gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 via-teal-100/10 to-blue-300/20 blur-2xl"></div>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex justify-center mb-3">
                  <motion.div
                    initial={{ rotate: -10 }}
                    animate={{ rotate: 10 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <Fish className="text-blue-600" size={36} />
                  </motion.div>
                </div>

                <h2 className="text-2xl font-semibold text-center text-blue-800 mb-6">
                  Welcome Back to FiSH
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white/80 backdrop-blur-md"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-400 focus:outline-none bg-white/80 backdrop-blur-md"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-blue-700 transition cursor-pointer"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.97 }}
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-semibold text-white shadow-lg bg-gradient-to-r from-blue-600 via-teal-500 to-blue-700 hover:from-blue-700 hover:to-teal-600 transition-all duration-300 cursor-pointer"
                  >
                    {loading ? "Signing in..." : "Login"}
                  </motion.button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-5">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={onRegister}
                    className="text-blue-700 font-medium hover:underline cursor-pointer"
                  >
                    Register
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
