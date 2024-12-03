// frontend/src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
  }
  return config;
});

// Handle token expiration or errors globally
api.interceptors.response.use(
  (response) => response, // Simply return the response if no error
  (error) => {
    // Handle 401 Unauthorized errors here
    if (error.response?.status === 401) {
      // Token expired or invalid, redirect user to login page
      localStorage.removeItem('token');
      // You should ideally handle the redirect in a component, not here
      console.error("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

export default api;
