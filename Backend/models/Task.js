const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "All"], // Can be extended if needed
    default: "Pending",
  },
  assignee: {
    type: String, // Can be a reference to a User model if you need user-specific data
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
