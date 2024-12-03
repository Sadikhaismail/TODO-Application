import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";  // Adjust the import path

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
      await api.post("/tasks", formData); // Send POST request to create the task
      setSuccessMessage("Task created successfully!");
      navigate("/dashboard");  // Redirect back to dashboard after creation
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      setErrorMessage("Failed to create task.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Create Task</h2>
      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task Description"
        />
        <select
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          required
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
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Task"}
        </button>
      </form>
    </div>
  );
};

export default CreateTask;
