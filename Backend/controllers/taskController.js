const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, status, assignee, dueDate } = req.body;
    const userId = req.user.id;  

    if (!title || !assignee || !dueDate) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const createdAt = new Date();
    const newTask = new Task({
      title,
      description,
      status,
      assignee,
      dueDate,
      userId,
      createdAt,
    });

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
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { status, assignee } = req.query;
    let filter = {};

    if (status && ["Pending", "Completed"].includes(status)) {
      filter.status = status;
    }
    if (assignee) {
      filter.assignee = assignee;
    }

    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

module.exports = { createTask, editTask, getAllTasks, deleteTask };