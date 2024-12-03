// backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware

// Enable CORS for the frontend running on port 3000 (React development server)
const corsOptions = {
  origin: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",  // Allow localhost:3000 for dev
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // If you need to send cookies with requests
};

app.use(cors(corsOptions));  // Use CORS middleware

app.use(express.json());

// Connect to the database
connectDB();

// Routes for the API
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Serve the React frontend in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "client", "build")));

  // Serve React app for all other routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
