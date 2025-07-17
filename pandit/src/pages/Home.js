import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);

  useEffect(() => {
    fetch('https://backendserver-6-yebf.onrender.com/api/pandits/verified')
      .then(res => res.json())
      .then(data => setPandits(data))
      .catch(err => console.error(err));

    fetch('https://backendserver-6-yebf.onrender.com/api/poojas/view')
      .then(res => res.json())
      .then(data => setPoojas(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="home-container">
      <header className="navbar-wrapper">
        <div className="navbar">
          <div className="logo-section">
            <img src="/images/shub.png" alt="Logo" className="logo-img" />
            <span className="logo-text">Shubkarya</span>
          </div>
          <nav className="nav-links">
            <a href="#about">About Us</a>
            <a href="#services">Explore Services</a>
            <a href="#footer">Contact</a>
            <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
          </nav>
        </div>
        <h1 className="spiritual-heading">Your Spiritual Partner:<br />For Every Sacred Occasion</h1>
      </header>

      <section className="hero">
        <h2 className="hero-subheading">Shubhkarya: <br />Your Trusted Online Pandit Booking</h2>
        <div className="hero-buttons">
          <button className="book-btn" onClick={() => navigate('/login')}>Book Now</button>
          <button className="meet-link" onClick={() => document.getElementById('pandits-section').scrollIntoView({ behavior: 'smooth' })}>Meet Our Pandits</button>
        </div>
      </section>

      <section id="services" className="services-section">
        <h2>Poojas Provided</h2>
        <div className="pooja-grid">
          {poojas.map(pooja => (
            <div key={pooja._id} className="pooja-card">
              <img src={pooja.imageUrl} alt={pooja.name} />
              <h3>{pooja.name}</h3>
              <p>{pooja.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pandits-section" className="pandit-section">
        <h2>Meet Our Pandits</h2>
        <div className="pandit-grid">
          {pandits.map(pandit => (
            <div key={pandit._id} className="pandit-card">
              <img src={pandit.profile_photo_url} alt={pandit.name} />
              <h3>{pandit.name}</h3>
              <p>{pandit.city}</p>
              <p>Experience: {pandit.experienceYears} years</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="footer" className="footer">
        <p>&copy; {new Date().getFullYear()} Shubkarya. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
