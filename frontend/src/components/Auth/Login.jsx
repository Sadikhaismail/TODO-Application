import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/login", formData);
      alert("login successful.");

      
      localStorage.setItem("token", data.token);
      login(data.token);

     
      // Redirect after a delay to show success message first
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500); // Give time for success message to appear
    } catch (error) {
      setIsLoading(false);
      if (error.response) {
        setError(error.response.data.message || "An error occurred. Please try again.");
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      
      
      {error && <p className="error">{error}</p>} {/* Display error message */}
    </div>
  );
};

export default Login;