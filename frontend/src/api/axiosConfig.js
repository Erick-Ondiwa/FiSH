import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // your backend URL
  withCredentials: true, // include session cookies
});

export default instance;
