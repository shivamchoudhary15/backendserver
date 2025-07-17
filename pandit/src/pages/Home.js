// src/pages/Home.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [panditRes, poojaRes, serviceRes] = await Promise.all([
          fetch('https://backendserver-pf4h.onrender.com/api/pandits/view'),
          fetch('https://backendserver-pf4h.onrender.com/api/poojas/view'),
          fetch('https://backendserver-pf4h.onrender.com/api/services/view'),
        ]);

        const panditsData = await panditRes.json();
        const poojasData = await poojaRes.json();
        const servicesData = await serviceRes.json();

        setPandits(panditsData.filter(p => p.is_verified));
        setPoojas(poojasData);
        setServices(servicesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/images/subh.png" alt="Shubhkarya logo" className="logo-img" />
          <span className="logo-text">Shubhkarya</span>
        </div>
        <div className="navbar-center">
          <span className="tagline">Your Spiritual Partner: For Every Sacred Occasion</span>
        </div>
        <div className="navbar-right">
          <a href="#about">About Us</a>
          <a href="#order">Explore Services</a>
          <a href="#services">Pooja</a>
          <a href="#pandits">Pandits</a>
          <a href="#footer" className="contact-link">Contact</a>
          <Link to="/login" className="login-box">Login</Link>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1>
              Shubkarya:<br />
              Your Trusted Online<br />
              Pandit Booking
            </h1>
            <p>
              Welcome to Shubhkarya, where you can easily book puja services, explore a wide range
              of pandit profiles, and enjoy a seamless booking experience.
            </p>
            <div className="hero-buttons">
              <button className="book-btn" onClick={() => navigate('/login')}>Book Now</button>
              <button className="meet-btn" onClick={() => navigate('#pandits')}>Meet Our Pandits</button>
            </div>
          </div>
          <div className="hero-right">
            <img src="/images/ho1.png" alt="Pandit" />
          </div>
        </div>
      </header>

      <section id="about" className="about">
        <h2>About Shubhkarya</h2>
        <p>
          Shubhkarya is a one-stop platform for booking verified Pandits and organizing sacred Poojas
          across traditions. We aim to bring spiritual services to your doorstep with ease and authenticity.
        </p>
      </section>

      <section id="order" className="services-section">
        <h2>Our Services</h2>
        <div className="card-section">
          {services.map(service => (
            <div key={service._id} className="highlight-card" style={{ backgroundImage: `url(${service.image})` }}>
              <div className="highlight-overlay">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <p>₹{service.price}</p>
                <button onClick={() => navigate('/login')}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="services">
        <h2>Poojas We Offer</h2>
        <div className="card-section">
          {poojas.map(pooja => (
            <div key={pooja._id} className="pooja-card">
              <h3>{pooja.name}</h3>
              <p>{pooja.description}</p>
              <p>₹{pooja.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pandits" className="pandits">
        <h2>Our Verified Pandits</h2>
        <div className="card-section">
          {pandits.map(pandit => (
            <div key={pandit._id} className="pandit-card">
              <img src={pandit.profile_photo_url.startsWith('/uploads') ? `https://backendserver-pf4h.onrender.com${pandit.profile_photo_url}` : pandit.profile_photo_url} alt={pandit.name} />
              <h3>{pandit.name}</h3>
              <p>{pandit.experience} years experience</p>
              <p>{pandit.language}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer" id="footer">
        <p>&copy; 2025 Shubhkarya. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
