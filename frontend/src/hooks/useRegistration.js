// useRegistration.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api";
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
    fish_species: "",
    age_group: "",
  });

  const navigate = useNavigate();

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
        try {
          const payload = {
            role: selectedRole?.replace(/_/g, " "),
            ...formData,
            confirm_password: formData.confirmPassword, // map correctly
          };

          delete payload.confirmPassword; // remove frontend-only field

          const res = await fetch(`${API_URL}/accounts/register/step1/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          console.log("Step 1 response:", data);

          if (!res.ok) {
            setErrors(data); // show backend validation errors
            return;
          }

          if (!data.user_id) {
            throw new Error("User ID not returned from server");
          }

          setUserId(data.user_id);
          setErrors({});
          setStep(2);

        } catch (err) {
          console.error("Step 1 error:", err);
          alert("Failed to complete Step 1. Please try again.");
        }
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
        const res = await fetch(`${API_URL}/accounts/register/step4/${userId}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert("Failed to complete registration");
          return;
        }

        alert(`${data.full_name} Registration Successful! Plesase procede to Login`);
        onClose();
        navigate("/login");
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