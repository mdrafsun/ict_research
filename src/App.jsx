// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import Navbar from './Components/Navbar/Navbar';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Future: <Route path="/register" element={<Register />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
