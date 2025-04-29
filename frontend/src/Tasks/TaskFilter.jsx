import React, { useEffect, useState } from 'react';
import api from '../Api';

const TaskFilter = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      const token = localStorage.getItem('token'); 

      if (!token) {
        setError('User not logged in');
        return;
      }

      try {
        const response = await api.get('tasks/summary', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSummary(response.data);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.message || 'Something went wrong');
        } else {
          setError('Failed to fetch summary');
        }
      }
    };

    fetchSummary();
  }, []);

  const fetchTasksByStatus = async (status) => {
    setLoading(true); 
    const token = localStorage.getItem('token');

    try {
      const response = await api.get(`tasks?status=${status}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTasks(response.data); 
      setLoading(false); 
    } catch (err) {
      setLoading(false); 
      setError(err.response ? err.response.data.message : 'Failed to fetch tasks');
    }
  };

  return (
    <div>
      <h2>Task Summary</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {summary ? (
        <div>
          <ul>
            <li>
              <button onClick={() => fetchTasksByStatus('all')}>Total Tasks</button>: {summary.totalTasks}
            </li>
            <li>
              <button onClick={() => fetchTasksByStatus('progress')}>In Progress</button>: {summary.inProgress}
            </li>
            <li>
              <button onClick={() => fetchTasksByStatus('review')}>In Review</button>: {summary.inReview}
            </li>
            <li>
              <button onClick={() => fetchTasksByStatus('completed')}>Completed</button>: {summary.completed}
            </li>
          </ul>

          {loading ? (
            <p>Loading tasks...</p>
          ) : (
            <div>
              {tasks.length > 0 ? (
                <ul>
                  {tasks.map((task) => (
                    <li key={task._id}>{task.name}</li>
                  ))}
                </ul>
              ) : (
                <p>No tasks found for this status</p>
              )}
            </div>
          )}
        </div>
      ) : !error ? (
        <p>Loading...</p>
      ) : null}
    </div>
  );
};

export default TaskFilter;
