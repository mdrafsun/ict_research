import React from 'react';
import './Navbar.css';
import { FaPhone, FaEnvelope, FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Navbar = () => {
  return (
    <>
      {/* Top Info Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <span><FaPhone /> +880 1234-567890</span>
          <span><FaEnvelope /> info@sahajgonit.com</span>
        </div>
        <div className="topbar-right">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaYoutube /></a>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
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
    </>
  );
};

export default Navbar;
