import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskStats, setTaskStats] = useState({
    total: 0,
    progress: 0,
    review: 0,
    completed: 0,
  });
  const isDueSoon = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 2;
  };
  
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const fetchAllTaskStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [total, progress, review, completed] = await Promise.all([
          api.get('/tasks/total', { headers }),
          api.get('/tasks/progress', { headers }),
          api.get('/tasks/review', { headers }),
          api.get('/tasks/completed', { headers }),
        ]);

        setTaskStats({
          total: total.data.length,
          progress: progress.data.length,
          review: review.data.length,
          completed: completed.data.length,
        });
      } catch (err) {
        console.error('Failed to fetch task stats:', err);
        setError('Failed to fetch task stats');
      }
    };

    fetchAllTaskStats();
  }, []);


const fetchTasks = async (status) => {
  const token = localStorage.getItem('token');
  let endpoint = '/tasks/total';
  if (status === 'progress') endpoint = '/tasks/progress';
  else if (status === 'review') endpoint = '/tasks/review';
  else if (status === 'completed') endpoint = '/tasks/completed';

  try {
    const response = await api.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks(response.data); 
    setSelectedCategory(status);
  } catch (err) {
    console.error('Error fetching tasks:', err);
  }
};


  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const chartData = [
    { name: 'In Progress', value: taskStats.progress },
    { name: 'In Review', value: taskStats.review },
    { name: 'Completed', value: taskStats.completed },
  ];

  if (error) return <div>{error}</div>;
  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex">

      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">Menu</h2>
        <nav className="space-y-4">
          <button onClick={() => navigate('/dashboard')} className="block w-full text-left hover:text-gray-300">Dashboard</button>
          <button onClick={() => navigate('/addTask')} className="block w-full text-left hover:text-gray-300">Todo List</button>
          <button onClick={handleLogout} className="block w-full text-left hover:text-gray-300">Logout</button>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

        <div className="p-6 mb-10 flex items-center gap-6">
          {user.profilePicture && (
            <img src={`http://localhost:5000/${user.profilePicture}`} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
          )}
          <div>
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-lg text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold cursor-pointer" onClick={() => fetchTasks('total')}>
              {taskStats.total}
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-lg text-gray-500">In Progress</p>
            <p className="text-2xl font-bold cursor-pointer" onClick={() => fetchTasks('progress')}>
              {taskStats.progress}
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-lg text-gray-500">In Review</p>
            <p className="text-2xl font-bold cursor-pointer" onClick={() => fetchTasks('review')}>
              {taskStats.review}
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-lg text-gray-500">Completed</p>
            <p className="text-2xl font-bold cursor-pointer" onClick={() => fetchTasks('completed')}>
              {taskStats.completed}
            </p>
          </div>
        </div>

        {tasks.length > 0 && (
  <div className="mt-10">
    <h3 className="text-xl font-semibold text-gray-800 capitalize mb-4">{selectedCategory} Tasks</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

 {tasks.map((task) => {
  const isCompleted = task.status === 'Completed';
  const dueSoon = isDueSoon(task.dueDate);

  const showWarning = dueSoon && !isCompleted;

  return (
    <div
      key={task._id}
      className={`p-4 shadow rounded ${
        showWarning ? 'bg-red-100 border border-red-300' : 'bg-white'
      }`}
    >
      <h4 className="text-lg font-bold">{task.name}</h4>
      <p className="text-gray-600">Status: {task.status}</p>
      <p className="text-gray-500">
        Start Date: {new Date(task.startDate).toLocaleDateString()}
      </p>
      <p className={showWarning ? 'text-red-600 font-semibold' : 'text-gray-500'}>
        Due Date: {new Date(task.dueDate).toLocaleDateString()}
        {showWarning && (
          <span className="ml-2 text-red-600 font-medium flex items-center gap-1">
            🚨 Due within 2 days
          </span>
        )}
      </p>
    </div>
  );
})}





      
    </div>
  </div>
)}




<div className="bg-white p-6 rounded shadow mt-10 max-w-3xl mx-auto">
  <h2 className="text-xl font-semibold mb-4 text-gray-900">Task Status Chart</h2>
  <div className="w-full">
    <ResponsiveContainer width="90%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" barSize={60} fill="#3182ce" />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>






      </main>
    </div>
  );
};

export default Dashboard;