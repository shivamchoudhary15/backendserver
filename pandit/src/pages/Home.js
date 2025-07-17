// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const backgroundImage = process.env.PUBLIC_URL + '/images/ho1.png';

  const scrollToFooter = () => {
    const footer = document.getElementById('footer');
    footer?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <header className="navbar-wrapper">
        <div className="navbar">
          <div className="logo-container">
            <img src="/images/shub.png" alt="logo" className="logo-image" />
            <div className="site-title">
              <h1>Shubkarya</h1>
              <p className="subtitle">Your Trusted<br />Online Pandit Booking</p>
            </div>
          </div>
          <nav className="nav-links">
            <button onClick={scrollToFooter} className="nav-button">Contact</button>
            <Link to="/services" className="nav-button">Explore Services</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </nav>
        </div>
        <div className="header-tagline">
          <h2>Your Spiritual Partner: For Every Sacred Occasion</h2>
        </div>
      </header>

      <section className="hero-section">
        <h2 className="hero-title">Book a Pandit Online for Your Pooja Needs</h2>
        <div className="hero-buttons">
          <Link to="/booking" className="book-btn">Book Now</Link>
          <Link to="/pandits" className="meet-link">Meet Our Pandits</Link>
        </div>
      </section>

      <footer id="footer" className="footer">
        <p>© 2025 Shubkarya. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
