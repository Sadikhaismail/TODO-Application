import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    status: "All",
    assignee: "",
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

  // Function to format dates
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
    navigate(`/task-editor/${taskId}`);  // Redirect to Task Editor for specific task
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      <button onClick={() => navigate("/tasks/create")}>Create New Task</button>

      {/* Filters */}
      <div>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          name="assignee"
          value={filters.assignee}
          onChange={handleFilterChange}
          placeholder="Filter by assignee"
        />
      </div>

      {/* Loading & Error Handling */}
      {loading && <p>Loading tasks...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Display tasks */}
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id} style={{ marginBottom: "20px" }}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Assignee: {task.assignee}</p>
            <p>Due: {formatDate(task.dueDate)}</p>
            <p>Created: {formatDate(task.creationDate)}</p> {/* Show the creationDate */}
            <button onClick={() => handleEditClick(task._id)}>Edit</button>
            <button
              onClick={() => handleDelete(task._id)}
              style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
};

export default Dashboard;
