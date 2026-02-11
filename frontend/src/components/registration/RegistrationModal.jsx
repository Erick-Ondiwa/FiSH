import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import ProgressBar from "../ui/ProgressBar";
import StepPersonalDetails from "./StepPersonalDetails";
import StepLocationDetails from "./StepLocationDetails";
import StepFarmingDetails from "./StepFarmingDetails";
import StepReview from "./StepReview";

import { API_URL } from "../../../api";

const TOTAL_STEPS = 4;

const RegistrationModal = ({ selectedRole, open, onClose }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    county: "",
    subcounty: "",
    place_of_farming: "",
    fish_species: [],
    age_group: "",
  });

  useEffect(() => {
    if (!open) {
      setStep(1);
      setErrors({});
      setSubmitting(false);
      setUserId(null);
      setFormData({
        full_name: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        county: "",
        subcounty: "",
        place_of_farming: "",
        fish_species: [],
        age_group: "",
      });
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!formData.full_name.trim()) e.full_name = "Full name is required.";
      if (!formData.email.match(/^\S+@\S+\.\S+$/)) e.email = "Valid email required.";
      if (!formData.phone.trim()) e.phone = "Phone is required.";
      if (!formData.password || formData.password.length < 8)
        e.password = "Password must be at least 8 characters long.";

      if (/^\d+$/.test(formData.password))
        e.password = "Password cannot be entirely numeric.";

      if (formData.password !== formData.confirmPassword)
        e.confirmPassword = "Passwords do not match";

    } else if (step === 2) {
      if (!formData.county.trim()) e.county = "County/Region is required.";
    } else if (step === 3) {
      if (!formData.place_of_farming) e.place_of_farming = "Select where you will farm.";
      if (!formData.fish_species.length)
        e.fish_species = "Select at least one fish species.";
      if (!formData.age_group) e.age_group = "Select the fish age group.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = async () => {
    if (!validateStep()) return;

    try {
      setSubmitting(true);
      const parts = formData.full_name.trim().split(" ");
      const first_name = parts[0];
      const last_name = parts.length > 1 ? parts.slice(1).join(" ") : "";
      // -------------------------------------------------------------
      // STEP 1 — Create or update personal details
      // -------------------------------------------------------------
      if (step === 1) {
        const payload = {
          role: selectedRole?.replace(/_/g, " "),
          first_name,
          last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        };

        let res, data;

        if (userId) {
          // Update existing user instead of recreating
          res = await fetch(`${API_URL}/auth/register/step1/${userId}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          // Create new user
          res = await fetch(`${API_URL}/auth/register/step1/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        }

        if (!res.ok) throw new Error("Failed to save Step 1");
        data = await res.json();

        if (!userId && data.user_id) setUserId(data.user_id);
        setStep(2);
        setErrors({});
        return;
      }
      // -------------------------------------------------------------
      // STEP 2 — Location Details
      // -------------------------------------------------------------
      if (step === 2) {
        if (!userId) throw new Error("User ID missing from Step 1!");

        const res = await fetch(`${API_URL}/auth/register/step2/${userId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            county: formData.county,
            subcounty: formData.subcounty,
          }),
        });

        if (!res.ok) throw new Error("Failed to save Step 2");
        setStep(3);
        setErrors({});
        return;
      }

      // -------------------------------------------------------------
      // STEP 3 — Farming Details
      // -------------------------------------------------------------
      if (step === 3) {
        if (!userId) throw new Error("User ID missing from Step 1!");

        const res = await fetch(`${API_URL}/auth/register/step3/${userId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            place_of_farming: formData.place_of_farming?.toLowerCase(),
            fish_species: formData.fish_species?.map((s) => s.toLowerCase()),
            age_group: formData.age_group?.toLowerCase(),
          }),
        });

        if (!res.ok) throw new Error("Failed to save Step 3");
        setStep(4);
        setErrors({});
        return;
      }

      // -------------------------------------------------------------
      // STEP 4 — Confirmation
      // -------------------------------------------------------------
      if (step === 4) {
        const res = await fetch(`${API_URL}/auth/register/step4/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });
        if (!res.ok) throw new Error("Failed to complete registration");
        const data = await res.json();

        alert(`Registration complete! Your username is ${data.username}`);
        onClose && onClose();
        return;
      }
    } catch (err) {
      console.error("Next Step Error:", err);
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const back = async () => {
    setErrors({});
    // If returning from Step 2 to Step 1
    if (step === 2 && userId) {
      try {
        const res = await fetch(`${API_URL}/auth/register/step1/${userId}/`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();

          // Update the form fields with data from backend
          setFormData((prev) => ({
            ...prev,
            full_name: data.first_name && data.last_name ? `${data.first_name} ${data.last_name}` : data.first_name || data.last_name || "",
            email: data.email || "",
            phone: data.phone || "",
            username: data.username || "",
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    }
    setStep((s) => Math.max(1, s - 1));
  };
  const handleSubmit = async () => {
    if (!userId) return alert("User ID not found — please complete previous steps.");
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/auth/register/step4/${userId}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          confirm: true,   
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Final confirmation failed.");
      }

      const data = await res.json();
      alert(`Registration successful! Your username: ${data.username}`);
      onClose && onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-blue-700/30 to-teal-600/20 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onClose && onClose()}
          />
          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-50 w-full max-w-3xl mx-4 mt-15 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Head */}
            <div className="px-6 py-4 border-b border-white/10 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-blue-900">Create your FiSH account</h2>
              </div>
              {/* <h2 className="text-2xl font-bold mb-4 text-blue-700">
                Register as {selectedRole?.replace(/_/g, " ") || "Aspiring Farmer"}
              </h2> */}

              <div className="flex items-center space-x-3">
                <div className="w-40 md:w-64">
                  <ProgressBar step={step} total={TOTAL_STEPS} />
                </div>
                <button
                  onClick={() => onClose && onClose()}
                  aria-label="Close"
                  className="p-2 rounded-md text-grey-900 font-bold hover:bg-white/20 cursor-pointer"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {step === 1 && (
                <StepPersonalDetails
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {step === 2 && (
                <StepLocationDetails
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {step === 3 && (
                <StepFarmingDetails
                  formData={formData}
                  setFormData={setFormData}
                  errors={errors}
                />
              )}
              {step === 4 && <StepReview formData={formData} />}
            </div>
            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/10">
              <div>
                {step > 1 && (
                  <button
                    onClick={back}
                    className="px-4 py-2 rounded-full bg-white/10 text-blue-700 hover:bg-white/20 transition cursor-pointer"
                  >
                    Back
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                {step < TOTAL_STEPS ? (
                  <button
                    onClick={next}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow cursor-pointer hover:from-blue-700 hover:to-teal-500 transition-all duration-300"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white cursor-pointer font-medium shadow disabled:opacity-60"
                  >
                    {submitting ? "Creating account..." : "Complete Registration"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default RegistrationModal;
