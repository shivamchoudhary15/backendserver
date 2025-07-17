// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const navigate = useNavigate();

  const handleScrollToFooter = () => {
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="home-container"
      style={{ backgroundImage: "url('/images/homebg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <header className="navbar-wrapper">
        <div className="navbar">
          <div className="logo-title">
            <img src="/images/shub.png" alt="Logo" className="logo-image" />
            <span className="site-name">Shubkarya</span>
          </div>
          <nav>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/poojas">Explore Services</Link></li>
              <li><button className="link-button" onClick={handleScrollToFooter}>Contact</button></li>
              <li>
                <Link to="/login" className="login-btn">Login</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-tagline">
          <h2>Your Spiritual Partner: <br />For Every Sacred Occasion</h2>
        </div>
      </header>

      <main className="hero-content">
        <h1 className="hero-heading">Shubhkarya:<br />Your Trusted Online Pandit Booking</h1>
        <div className="cta-buttons">
          <button onClick={() => navigate('/login')} className="book-btn">Book Now</button>
          <Link to="/pandits" className="meet-link">Meet Our Pandits</Link>
        </div>
      </main>

      <footer id="footer" className="footer">
        <p>&copy; 2025 Shubkarya. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
