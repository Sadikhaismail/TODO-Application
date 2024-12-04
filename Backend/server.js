require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();


const corsOptions = {
  origin: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",  
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));  

app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));