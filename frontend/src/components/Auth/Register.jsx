import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", formData);
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (error) {
      if (error.response?.data?.message === "User already exists") {
        setErrorMessage("This email is already registered. Please use a different one.");
      } else {
        setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.");
      }
      console.error(error.response?.data?.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2 className="register-heading">Register</h2>
        {errorMessage && <p className="register-error">{errorMessage}</p>}
        <input
          className="register-input"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          className="register-input"
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button className="register-button" type="submit">Register</button>
        <div className="register-link">
          Already registered? <Link className="register-login-link" to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;