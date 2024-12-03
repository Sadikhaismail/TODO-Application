import React, { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // Fetch tasks on page load
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks/all");
        setTasks(data);  // Update the state with fetched tasks
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    };
    fetchTasks();
  }, []); // This will run only once when the component mounts

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/delete/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId)); // Remove task from state after deletion
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div>
      <h2>Your Tasks</h2>
      <button onClick={() => navigate("/task-editor")}>Create New Task</button>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task._id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <button onClick={() => navigate(`/task-editor/${task._id}`)}>Edit</button>
            <button
              onClick={() => handleDelete(task._id)}
              style={{
                marginTop: "10px",
                backgroundColor: "red",
                color: "white",
              }}
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
