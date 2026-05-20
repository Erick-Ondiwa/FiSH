import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import ProgressBar from "./ProgressBar";
import StepPersonalDetails from "./StepPersonalDetails";
import StepLocationDetails from "./StepLocationDetails";
import StepFarmingDetails from "./StepFarmingDetails";
import StepReview from "./StepReview";

import { useRegistration } from "../../hooks/useRegistration";

const TOTAL_STEPS = 4;

const RegistrationModal = ({ selectedRole, open, onClose }) => {
  const {
    step,
    formData,
    setFormData,
    next,
    back,
    errors,
    submitting,
  } = useRegistration(selectedRole, onClose);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* 🔹 BACKDROP */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* 🔹 MODAL */}
        <motion.div
          initial={{ scale: 0.95, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 30, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl bg-slate-800 border border-slate-700 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* 🔹 SUBTLE TOP ACCENT */}
          <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500" />

          {/* 🔹 HEADER */}
          <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Create your FiSH account
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Step {step} of {TOTAL_STEPS}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 md:w-48">
                <ProgressBar step={step} total={TOTAL_STEPS} />
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* 🔹 BODY */}
          <div className="p-6 md:p-8 bg-slate-800">
            {step === 1 && (
              <StepPersonalDetails {...{ formData, setFormData, errors }} />
            )}
            {step === 2 && (
              <StepLocationDetails {...{ formData, setFormData, errors }} />
            )}
            {step === 3 && (
              <StepFarmingDetails {...{ formData, setFormData, errors }} />
            )}
            {step === 4 && <StepReview formData={formData} />}
          </div>

          {/* 🔹 FOOTER */}
          <div className="flex items-center justify-between px-6 py-5 border-t border-slate-700 bg-slate-800">
            
            {/* BACK */}
            <div>
              {step > 1 && (
                <button
                  onClick={back}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium transition"
                >
                  Back
                </button>
              )}
            </div>

            {/* NEXT / COMPLETE */}
            <button
              onClick={next}
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition disabled:opacity-40 shadow-md"
            >
              {submitting
                ? "Processing..."
                : step === TOTAL_STEPS
                ? "Complete Registration"
                : "Continue"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RegistrationModal;