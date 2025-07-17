// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const navigate = useNavigate();

  const handleContactClick = () => {
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url('/images/ho1.png')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <div className="navbar-wrapper">
        <div className="navbar">
          <div className="logo">
            <span className="logo-text">Shubkarya</span>
          </div>
          <div className="nav-links">
            <a onClick={handleContactClick}>Contact</a>
            <Link to="/about">About Us</Link>
            <Link to="/services">Explore Services</Link>
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="hero-section">
        <h1 className="main-heading">
          Shubhkarya:<br />Your Trusted Online Pandit Booking
        </h1>
        <p className="sub-heading">Your Spiritual Partner: For Every Sacred Occasion</p>
        <div className="hero-buttons">
          <button onClick={() => navigate('/booking')} className="book-btn">Book Now</button>
          <span className="meet-text">Meet Our Pandits</span>
        </div>
      </div>

      {/* Footer */}
      <footer id="footer" className="footer">
        <p>&copy; 2025 Shubkarya. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
