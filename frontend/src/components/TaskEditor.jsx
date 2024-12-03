// frontend/src/components/TaskEditor.js
import React, { useState } from "react";
import api from "../api/api";

const TaskEditor = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    dueDate: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", formData);
      alert("Task saved!");
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add/Edit Task</h2>
      <input name="title" placeholder="Title" onChange={handleChange} required />
      <input name="description" placeholder="Description" onChange={handleChange} />
      <input name="assignee" placeholder="Assignee" onChange={handleChange} required />
      <input type="date" name="dueDate" onChange={handleChange} required />
      <select name="status" onChange={handleChange}>
        <option value="Pending">Pending</option>
        <option value="Completed">Completed</option>
      </select>
      <button type="submit">Save</button>
    </form>
  );
};

export default TaskEditor;
