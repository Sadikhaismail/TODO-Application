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

module.exports = { createTask };
