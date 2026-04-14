// useRegistration.js
import { useState } from "react";
import { API_URL } from "../../../../api";
import { validateStep } from "./validation";

export const useRegistration = (selectedRole, onClose) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    full_name: "",
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

  const next = async () => {
    const validationErrors = validateStep(step, formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);

      // STEP 1
      if (step === 1) {
        const res = await fetch(`${API_URL}/accounts/register/step1/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: selectedRole?.replace(/_/g, " "),
            ...formData,
          }),
        });

        const data = await res.json();
        setUserId(data.user_id);
        setStep(2);
      }

      // STEP 2
      if (step === 2) {
        await fetch(`${API_URL}/accounts/register/step2/${userId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        setStep(3);
      }

      // STEP 3
      if (step === 3) {
        await fetch(`${API_URL}/accounts/register/step3/${userId}/`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        setStep(4);
      }

      // STEP 4
      if (step === 4) {
        const res = await fetch(`${API_URL}/accounts/register/step4/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await res.json();
        alert(`Registration complete! Username: ${data.username}`);
        onClose();
      }

      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const back = () => setStep((s) => Math.max(1, s - 1));

  return {
    step,
    formData,
    setFormData,
    next,
    back,
    errors,
    submitting,
  };
};