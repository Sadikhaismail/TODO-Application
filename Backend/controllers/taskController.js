// backend/controllers/taskController.js
const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, status, assignee, dueDate } = req.body;
    const userId = req.user.id;

    if (!title || !assignee || !dueDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newTask = new Task({ title, description, status, assignee, dueDate, userId });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignee, dueDate } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, status, assignee, dueDate },
      { new: true, runValidators: true } // Return updated document and validate inputs
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task updated successfully.", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  editTask,
  getAllTasks,
  getTaskById,  // Export the new function
  deleteTask,
};
