import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../../api";

import { motion, AnimatePresence } from "framer-motion";
import { Fish, X } from "lucide-react";

const LoginModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegister,
  asPage = false,
}) => {
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
      const res = await axios.post(`${API_URL}/accounts/token/`, {
        email: formData.email,
        password: formData.password,
      });

      const { access, refresh } = res.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      onLoginSuccess(res.data.user);

      // ✅ Only close if it's actually a modal
      if (!asPage && onClose) onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Control rendering correctly
  if (!isOpen && !asPage) return null;

  // === Layout modes ===
  const containerClass = asPage
    ? "w-full flex items-center justify-center py-10"
    : "fixed inset-0 z-50 flex items-center justify-center px-4";

  const cardClass = asPage
    ? "relative w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl shadow-xl p-8"
    : "relative w-full max-w-md bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl p-8";

  return (
    <AnimatePresence mode="wait">
      {(isOpen || asPage) && (
        <>
          {/* === OVERLAY (MODAL ONLY) === */}
          {!asPage && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}

          {/* === CONTAINER === */}
          <motion.div
            className={containerClass}
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            {/* === CARD === */}
            <div className={cardClass}>
              
              {/* CLOSE (ONLY MODAL) */}
              {!asPage && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition"
                >
                  <X size={22} />
                </button>
              )}

              {/* ICON */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className={`p-3 rounded-xl ${
                    asPage
                      ? "bg-teal-500 text-teal-400"
                      : "bg-teal-500/10 text-teal-400"
                  }`}
                >
                  <Fish size={28} />
                </motion.div>
              </div>

              {/* TITLE */}
              <h2
                className={`text-2xl font-bold text-center mb-1 ${
                  asPage ? "text-white" : "text-white"
                }`}
              >
                Welcome Back
              </h2>

              <p
                className={`text-center text-sm mb-6 ${
                  asPage ? "text-slate-400" : "text-slate-400"
                }`}
              >
                Sign in to continue to FiSH
              </p>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* EMAIL */}
                <div>
                  <label
                    className={`text-xs mb-1 block ${
                      asPage ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg px-4 py-3 text-sm outline-none border ${
                      asPage
                        ? "bg-slate-900 border-slate-700 text-slate-200 focus:ring-2 focus:ring-teal-500/40"
                        : "bg-slate-900 border-slate-700 text-slate-200 focus:ring-2 focus:ring-teal-500/40"
                    }`}
                    placeholder="you@example.com"
                    required
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    className={`text-xs mb-1 block ${
                      asPage ? "text-slate-400" : "text-slate-400"
                    }`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full rounded-lg px-4 py-3 text-sm outline-none border ${
                        asPage
                          ? "bg-slate-900 border-slate-700 text-slate-200 focus:ring-2 focus:ring-blue-500/40"
                          : "bg-slate-900 border-slate-700 text-slate-200 focus:ring-2 focus:ring-teal-500/40"
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute top-1/2 right-3 -translate-y-1/2 text-xs ${
                        asPage
                          ? "text-slate-500 hover:text-teal-400"
                          : "text-slate-500 hover:text-teal-400"
                      }`}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* ERROR */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* BUTTON */}
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${
                    asPage
                      ? "bg-teal-500 hover:bg-teal-600"
                      : "bg-teal-500 hover:bg-teal-600"
                  } disabled:opacity-40`}
                >
                  {loading ? "Signing in..." : "Login"}
                </motion.button>
              </form>

              {/* FOOTER */}
              <p
                className={`text-center text-sm mt-6 ${
                  asPage ? "text-slate-400" : "text-slate-400"
                }`}
              >
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={onRegister}
                  className={`font-medium ${
                    asPage
                      ? "text-teal-400 hover:underline"
                      : "text-teal-400 hover:underline"
                  }`}
                >
                  Register
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;