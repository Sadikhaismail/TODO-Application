// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import api from "../api/api";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks");
        setTasks(data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Your Tasks</h2>
      {tasks.map((task) => (
        <div key={task._id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Status: {task.status}</p>
          <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
