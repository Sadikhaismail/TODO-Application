import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const TaskEditor = () => {
  const { id } = useParams();
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

  const assignees = ['Kiara', 'Abin', 'John', 'Emily'];

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken'),
      });
      const newAccessToken = response.data.token;
      localStorage.setItem('token', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      return null;
    }
  }, [logout]);

  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (isTokenExpired(token)) {
        const newToken = await refreshToken();
        if (!newToken) return;
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
          logout();
        } else {
          setErrorMessage('');
        }
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, logout, refreshToken]);

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decoded.exp * 1000;
    return expirationTime < Date.now();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.title || !formData.assignee || !formData.dueDate) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/tasks/edit/${id}`, formData);
      setSuccessMessage('Task updated successfully!');
      setErrorMessage('');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      setSuccessMessage('');
      setErrorMessage('Failed to update task. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Edit Task</h2>
      {loading && <p style={{ textAlign: 'center', color: '#555' }}>Loading...</p>}
      {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title"
          required
          style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description"
          style={{
            padding: '10px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            height: '100px',
          }}
        />
        <select
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          required
          style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
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
          style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{ padding: '10px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px',
            fontSize: '14px',
            borderRadius: '4px',
            border: 'none',
            backgroundColor: '#007BFF',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving...' : 'Save Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskEditor;
