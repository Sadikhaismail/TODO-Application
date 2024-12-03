import React, { useState, useEffect } from "react";
import api from "../api/api"; // Ensure you have api configured to interact with your backend
import { useParams, useNavigate } from "react-router-dom";

const TaskEditor = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    status: "Pending",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await api.get(`/tasks/${id}`);
          setFormData(response.data); // Set the data for editing
        } catch (error) {
          console.error(error.response?.data?.message || error.message);
        }
      };
      fetchTask();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Editing an existing task
        await api.put(`/tasks/edit/${id}`, formData);
        alert("Task updated!");
        navigate("/dashboard"); // Redirect to the dashboard after task update
      } else {
        // Creating a new task
        await api.post("/tasks", formData);
        alert("Task created!");
        navigate("/dashboard"); // Redirect to the dashboard after task creation
      }

      // Reset form data after submission
      setFormData({
        title: "",
        description: "",
        assignee: "",
        dueDate: "",
        status: "Pending",
      });
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>{id ? "Edit Task" : "Create Task"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          name="assignee"
          placeholder="Assignee"
          value={formData.assignee}
          onChange={handleChange}
          required
        />
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
        <button type="submit">
          {id ? "Update Task" : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskEditor;
