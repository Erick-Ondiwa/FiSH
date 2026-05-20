export const validateStep = (step, formData) => {
  const errors = {};

  if (step === 1) {
    if (!formData.full_name) errors.full_name = "Full name required";

    if (!formData.email) {
      errors.email = "Email required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.password) {
      errors.password = "Password required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  if (step === 2) {
    if (!formData.county) errors.county = "County required";
    if (!formData.subcounty) errors.subcounty = "Subcounty required";
  }

  if (step === 3) {
    if (!formData.place_of_farming) {
      errors.place_of_farming = "Required";
    }

    if (!formData.fish_species || formData.fish_species.length === 0) {
      errors.fish_species = "Select at least one species";
    }

    if (!formData.age_group) {
      errors.age_group = "Age group required";
    }
  }

  return errors;
};