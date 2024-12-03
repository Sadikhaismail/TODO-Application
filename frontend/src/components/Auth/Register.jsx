// frontend/src/components/Auth/Register.js
import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate to redirect after registration

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(""); // To hold the error message
  const navigate = useNavigate(); // To navigate to the login page after successful registration

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending the form data to the backend for registration
      await api.post("/auth/register", formData);
      alert("Registration successful. Please log in.");
      navigate("/login"); // Redirect to login page after successful registration
    } catch (error) {
      // Check if the error is due to the user already existing
      if (error.response?.data?.message === "User already exists") {
        setErrorMessage("This email is already registered. Please use a different one.");
      } else {
        setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
      }
      console.error(error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>} {/* Display error message if any */}
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
