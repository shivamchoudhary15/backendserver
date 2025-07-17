// src/pages/Home.js

import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const navigate = useNavigate();
  const footerRef = useRef(null);

  useEffect(() => {
    fetch('https://backendserver-6-yebf.onrender.com/api/pandits/verified')
      .then((res) => res.json())
      .then((data) => setPandits(data))
      .catch((err) => console.error('Error fetching pandits:', err));

    fetch('https://backendserver-6-yebf.onrender.com/api/poojas/view')
      .then((res) => res.json())
      .then((data) => setPoojas(data))
      .catch((err) => console.error('Error fetching poojas:', err));
  }, []);

  const scrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-container">
      <div className="navbar-wrapper">
        <nav className="navbar">
          <h2 className="site-title">Shubkarya</h2>
          <div className="nav-links">
            <a href="#about">About Us</a>
            <a href="#pandits">Meet Our Pandits</a>
            <a href="#poojas">Pooja Provided</a>
            <a onClick={scrollToFooter} style={{ cursor: 'pointer' }}>Contact</a>
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </nav>
      </div>

      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Shubhkarya:<br />Your Trusted Online Pandit Booking</h1>
          <p className="hero-subtitle">Your Spiritual Partner: For Every Sacred Occasion</p>
          <div className="hero-buttons">
            <Link to="/login" className="book-btn">Book Now</Link>
          </div>
          <p className="meet-text">Meet Our Pandits</p>
        </div>
      </header>

      <section id="poojas" className="pooja-section">
        <h2>Explore Services</h2>
        <div className="pooja-list">
          {poojas.map((pooja) => (
            <div key={pooja._id} className="pooja-card">
              <img src={pooja.imageUrl} alt={pooja.name} />
              <h3>{pooja.name}</h3>
              <p>{pooja.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pandits" className="pandit-section">
        <h2>Meet Our Verified Pandits</h2>
        <div className="pandit-list">
          {pandits.map((pandit) => (
            <div key={pandit._id} className="pandit-card">
              <img src={pandit.profile_photo_url} alt={pandit.name} />
              <h3>{pandit.name}</h3>
              <p>{pandit.city}</p>
            </div>
          ))}
        </div>
      </section>

      <footer ref={footerRef} className="footer">
        <p>Contact us at support@shubkarya.in</p>
        <p>&copy; 2025 Shubkarya. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
