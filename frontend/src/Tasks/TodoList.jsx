import React, { useEffect, useState } from 'react';
import api from '../Api';
import { FaEdit, FaTrash } from 'react-icons/fa';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    name: '',
    status: 'Progress',
    startDate: '',
    dueDate: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    fetchTasks();
    checkUserLoggedIn(); 
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/tasks/total', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Error fetching tasks');
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };
  
  const getNextDate = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };
  
  const checkUserLoggedIn = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      setIsLoggedIn(false);
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await api.put(`/tasks/${editingTaskId}`, form); 
      } else {
        const response = await api.post('/tasks/add', form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
          },
        });
  
        console.log('Task added:', response.data);  
      }
      setForm({ name: '', status: 'Progress', startDate: '', dueDate: '' });
      setIsModalOpen(false);
      setEditingTaskId(null);
      fetchTasks();  
      setErrorMessage('');  
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Error adding task');
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting task');
    }
  };

  const handleEdit = (task) => {
    const startDate = new Date(task.startDate).toISOString().split('T')[0];
    const dueDate = new Date(task.dueDate).toISOString().split('T')[0];

    setForm({ ...task, startDate, dueDate });
    setEditingTaskId(task._id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); 
    setEditingTaskId(null); 
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div className="flex flex-col md:flex-row gap-10">
        {isLoggedIn && (
          <div className="w-full md:w-1/2 bg-white shadow-md p-10 rounded-md">
            <h1 className="text-5xl font-semibold text-center mb-10">ADD TASK</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {errorMessage && (
                <div className="text-red-600 text-lg mt-2">{errorMessage}</div>
              )}
              <input
                type="text"
                name="name"
                placeholder="Task Name"
                value={form.name}
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-5 rounded"
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
                className="border border-gray-300 px-4 py-5 rounded"
              >
                <option value="Progress">Progress</option>
                <option value="review">Review</option>
                <option value="Completed">Completed</option>
              </select>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                min={getTodayDate()}
                className="border border-gray-300 px-4 py-5 rounded"
              />
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
                min={form.startDate ? getNextDate(form.startDate) : getTodayDate()}
                className="border border-gray-300 px-4 py-5 rounded"
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-5 rounded hover:bg-green-700 transition"
              >
                {editingTaskId ? 'Update Task' : 'Add Task'}
              </button>
            </form>
          </div>
        )}

        <div className="w-full md:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Tasks</h2>
          <input
            type="text"
            placeholder="Search tasks by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded mb-4 w-160"
          />
          {tasks.filter(task => task.status !== 'Completed').length === 0 ? (
            <p className="text-gray-500">No tasks</p>
          ) : (
            <div className="overflow-y-auto max-h-[600px]">
              <ul className="space-y-4">
                {tasks
                  .filter((task) => task.status !== 'Completed')
                  .filter((task) => task.name.toLowerCase().includes(searchQuery.toLowerCase())) // Filter tasks based on search query
                  .map((task) => (
                    <li
                      key={task._id}
                      className="bg-white px-6 py-4 rounded-lg shadow-md relative"
                    >
                      <p className="text-xl font-semibold text-gray-900 mb-1">{task.name}</p>
                      <p className="text-lg text-gray-800 mb-1">Status: {task.status}</p>
                      <p className="text-lg text-gray-800 mb-1">Start Date: {task.startDate.slice(0, 10)}</p>
                      <p className="text-lg text-gray-800 mb-2">Due Date: {task.dueDate.slice(0, 10)}</p>

                      <div className="absolute top-4 right-4 flex space-x-3">
                        <button
                          onClick={() => handleEdit(task)}
                          title="Edit"
                          className="transition-transform duration-200 hover:scale-125"
                        >
                          <FaEdit className="text-green-600 text-3xl" />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          title="Delete"
                          className="transition-transform duration-200 hover:scale-125"
                        >
                          <FaTrash className="text-red-600 text-3xl" />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Task Name"
                  value={form.name}  
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                  required
                />
                <select
                  name="status"
                  value={form.status}  
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                >
                  <option value="review">Review</option>
                  <option value="Progress">Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                  min={getTodayDate()}
                  required
                />
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2"
                  min={form.startDate ? getNextDate(form.startDate) : getTodayDate()}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Update Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;
