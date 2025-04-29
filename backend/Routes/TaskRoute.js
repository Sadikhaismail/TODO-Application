const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/AuthMiddleware');
const Task = require('../Models/TaskModel');

// Add task
router.post('/add', authMiddleware, async (req, res) => {
  try {
    console.log(req.user); 
    const { name, status, startDate, dueDate } = req.body;
    const userId = req.user.userId; 

if (!name || !status || !startDate || !dueDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    
    const newTask = new Task({ name, status, startDate, dueDate, userId });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: err.message });
  }
});



// Update task
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId }, 
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId 
    });

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found or not owned by user' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/summary', authMiddleware, async (req, res) => {
  try {
    if (!req.user.userId) { 
      return res.status(400).json({ error: 'User not authenticated' });
    }

    const userId = req.user.userId;

    const total = await Task.countDocuments({ userId });
    const progress = await Task.countDocuments({ userId, status: 'Progress' });
    const review = await Task.countDocuments({ userId, status: 'review' });
    const completed = await Task.countDocuments({ userId, status: 'Completed' });

    res.json({
      totalTasks: total,
      progress, 
      review,
      completed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

router.get('/total', authMiddleware, async (req, res) => {
  try {
    const { name } = req.query; 
    const query = { userId: req.user.userId };

    if (name) {
      query.name = { $regex: name, $options: 'i' }; 
    }

    const tasks = await Task.find(query); 

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' }); 
  }
});



router.get('/progress', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId, status: 'Progress' })
      .select('name status startDate dueDate');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



// In Review
router.get('/review', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId, status: 'review' })
      .select('name status startDate dueDate');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// Completed
router.get('/completed', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.userId, status: 'Completed' })
      .select('name status startDate dueDate');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});









module.exports = router;
