import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; 

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const assignees = ["Kiara", "Abin", "John", "Emily"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!formData.title || !formData.assignee || !formData.dueDate) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/tasks", formData); 
      setSuccessMessage("Task created successfully!");
      navigate("/dashboard"); 
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      setErrorMessage("Failed to create task.");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "80px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        Create Task
      </h2>
      {loading && <p style={{ textAlign: "center", color: "#555" }}>Loading...</p>}
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p style={{ color: "green", textAlign: "center", marginBottom: "10px" }}>
          {successMessage}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task Description"
          style={{
            width:"595px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1rem",
            height:"100px",
          }}
        />
        <select
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <option value="">Select Assignee</option>
          {assignees.map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1rem",
          }}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "1rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            fontWeight: "bold",
            backgroundColor: "#4caf50",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Saving..." : "Save Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
