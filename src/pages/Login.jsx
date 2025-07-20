// src/Pages/Login.jsx
import React from 'react';
import './Login.css'; // We'll style it later

const Login = () => {
  return (
    <div className="login-container">
      <h1>স্বাগতম সহজ গণিতে</h1>

      <form className="login-form">
        <input type="text" placeholder="Type your e-mail or phone number" />
        <input type="password" placeholder="Type your password" />
        <button type="submit">Login</button>
        <p>Don't have an account? <a href="/signup">Sign up</a></p>

      </form>
    </div>
  );
};

export default Login;
