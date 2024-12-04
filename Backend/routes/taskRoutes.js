const express = require("express");
const { createTask, editTask, getAllTasks, deleteTask, getTaskById } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createTask);
router.put("/edit/:id", authMiddleware, editTask);
router.get("/all", authMiddleware, getAllTasks);
router.delete("/delete/:id", authMiddleware, deleteTask);

module.exports = router;
