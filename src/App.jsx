// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; 
import Signup from './pages/Signup';
import Navbar from './Components/Navbar/Navbar';
import Footer from './Components/Footer/Footer'; // ✅ import footer



const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Future: <Route path="/register" element={<Register />} /> */}
      </Routes>
            <Footer /> {/* ✅ use footer here */}

    </Router>
  );
};

export default App;
