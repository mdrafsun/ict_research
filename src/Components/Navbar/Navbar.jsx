import React from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>
      <ul className="navbar-links">
        <li>হোম</li>
        <li>লেকচার</li>
        <li>বই এবং পিডিএফ</li>
        <li>গ্রাফ ক্যালকুলেটর</li>
      </ul>
      <div className="navbar-auth">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
