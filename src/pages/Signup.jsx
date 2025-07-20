// src/pages/Signup.jsx
import React from 'react';
import './Signup.css';

const Signup = () => {
  return (
    <div className="signup-container">
      <h1>স্বাগতম সহজ গণিতে</h1>
      <p>Create a new account</p>

      <form className="signup-form">
        <input type="text" placeholder="Full Name" />
        <input type="email" placeholder="Email or phone number" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <button type="submit">Sign Up</button>
        <p>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Signup;
