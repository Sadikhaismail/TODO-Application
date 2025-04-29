import { Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Register from './User/Register';
import Login from './User/Login';
import AddTask from './Tasks/TodoList';
import Dashboard from './Components/Dashboard';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/addTask" element={<AddTask />} />
      <Route path="/dashboard" element={<Dashboard />} />


    </Routes>
  );
}

export default App;
