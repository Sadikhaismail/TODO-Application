import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "All",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Fetch tasks when filters change
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/tasks/all", { params: filters });
        setTasks(data);
        setLoading(false);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        setErrorMessage("Failed to load tasks.");
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filters]);

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/delete/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId)); // Functional setState
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      setErrorMessage("Failed to delete task.");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date"; // Return 'Invalid Date' if no value
    const date = new Date(dateString);
    return date.getTime()
      ? date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Invalid Date"; // Check if the date is valid
  };

  const handleEditClick = (taskId) => {
    navigate(`/task-editor/${taskId}`); // Redirect to Task Editor for specific task
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {/* Dashboard Heading */}
      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "30px",
          fontWeight: "bold",
          color: "#333",
          textAlign: "center",
        }}
      >
        Dashboard
      </h2>

      {/* Centered Intro Message */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h3 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          Begin to manage your tasks
        </h3>
        <button
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            borderRadius: "5px",
            width: "300px",
          }}
          onClick={() => navigate("/tasks/create")}
        >
          Create New Task
        </button>
        <p
          style={{
            fontSize: "1rem",
            color: "#666",
            marginTop: "10px",
          }}
        >
          You can edit and delete your tasks here
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", marginBottom: "20px", justifyContent: "center" }}>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          style={{
            padding: "8px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "250px",
            backgroundColor: "#333",
            color: "white",
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Loading & Error Handling */}
      {loading && (
        <p style={{ fontSize: "1.2rem", textAlign: "center" }}>Loading tasks...</p>
      )}
      {errorMessage && (
        <p style={{ color: "red", fontSize: "1.1rem", marginTop: "10px", textAlign: "center" }}>
          {errorMessage}
        </p>
      )}

      {/* Display tasks */}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                {task.title}
              </h3>
              <p style={{ fontSize: "1.2rem", marginBottom: "10px", color: "#666" }}>
                {task.description}
              </p>
              <p style={{ fontSize: "1rem", marginBottom: "5px" }}>Status: {task.status}</p>
              <p style={{ fontSize: "1rem", marginBottom: "5px" }}>Assignee: {task.assignee}</p>
              <p style={{ fontSize: "1rem", marginBottom: "5px" }}>
                Due: {formatDate(task.dueDate)}
              </p>
              <p style={{ fontSize: "1rem", marginBottom: "5px" }}>
                Created: {formatDate(task.creationDate)}
              </p>
            </div>

            {/* Task Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
              }}
            >
              <button
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  width:"100px",

                }}
                onClick={() => handleEditClick(task._id)}
              >
                Edit
              </button>
              <button
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  width:"100px",
                }}
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <p style={{ fontSize: "1.2rem", textAlign: "center" }}>No tasks available.</p>
      )}
    </div>
  );
};

export default Dashboard;
