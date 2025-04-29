const express = require("express");
const connectDB = require("./Config/DB");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const userRoutes = require("./Routes/UserRoute");
const TaskRoutes = require("./Routes/TaskRoute");

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));




app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}


connectDB();

app.use(express.json());
app.use('/users', userRoutes);
app.use('/tasks', TaskRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
