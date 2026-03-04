import axios from "./axiosConfig"; // your preconfigured axios instance
import Cookies from "js-cookie";

export const fetchCsrfToken = async () => {
  try {
    // Fetch CSRF token from backend endpoint
    await axios.get("/auth/csrf/"); // sets cookie
    // Read the token from cookie
    const token = Cookies.get("csrftoken");
    return token;
  } catch (err) {
    console.error("Failed to fetch CSRF token", err);
    return null;
  }
};
