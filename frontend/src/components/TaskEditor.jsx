import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const TaskEditor = () => {
  const { id } = useParams();  // Get task ID from URL
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: '',
    status: 'Pending',
    createDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const assignees = ["Kiara", "Abin", "John", "Emily"];

  // Memoize the logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  }, [navigate]);

  // Memoize the refreshToken function
  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      const newAccessToken = response.data.token;
      localStorage.setItem('token', newAccessToken);  // Store new token
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();  // Log out if refresh fails
      return null;
    }
  }, [logout]);

  // Fetch task details when component mounts or when the task ID changes
  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      // If token is expired, try refreshing
      if (isTokenExpired(token)) {
        const newToken = await refreshToken();
        if (!newToken) return;  // Exit if token can't be refreshed
      }

      try {
        const response = await api.get(`/tasks/${id}`);
        setFormData({
          ...response.data,
          createDate: new Date(response.data.createdAt).toLocaleDateString(),
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task:', error);
        if (error.response?.data?.message === 'Token expired') {
          setErrorMessage('Session expired. Please log in again.');
          logout();  // Log out if token expired
        } else {
          setErrorMessage('Failed to load task.');
        }
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, logout, refreshToken]);  // Add logout and refreshToken to the dependencies array

  // Check if the token is expired
  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decoded.exp * 1000;  // Convert exp to milliseconds
    return expirationTime < Date.now();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');  // Clear any previous error message
    setSuccessMessage('');  // Clear any previous success message

    if (!formData.title || !formData.assignee || !formData.dueDate) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      console.log("Updating task with data: ", formData); // Log form data
      const response = await api.put(`/tasks/edit/${id}`, formData); // Update task with formData
      console.log("API response: ", response); // Log API response

      // Success: Update message and navigate away
      setSuccessMessage('Task updated successfully!');
      setErrorMessage('');  // Clear any existing error message
      navigate('/dashboard');  // Navigate back to the dashboard after updating the task
    } catch (error) {
      console.error("API error: ", error); // Log error to console
      setSuccessMessage('');  // Clear any success message
      setErrorMessage('Failed to update task. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Edit Task</h2>
      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
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
          {loading ? 'Saving...' : 'Save Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskEditor;
