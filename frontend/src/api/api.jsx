// frontend/src/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");  // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Add token to Authorization header
  }
  return config;
});

export default api;
