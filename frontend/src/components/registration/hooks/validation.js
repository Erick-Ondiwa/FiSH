// validation.js
export const validateStep = (step, formData) => {
  const errors = {};

  if (step === 1) {
    if (!formData.full_name) errors.full_name = "Full name required";
    if (!formData.email) errors.email = "Email required";
    if (!formData.password) errors.password = "Password required";
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  if (step === 2) {
    if (!formData.county) errors.county = "County required";
  }

  if (step === 3) {
    if (!formData.place_of_farming) {
      errors.place_of_farming = "Required";
    }
  }

  return errors;
};