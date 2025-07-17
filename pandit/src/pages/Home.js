// src/pages/Home.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [panditRes, serviceRes] = await Promise.all([
          fetch('https://backendserver-pf4h.onrender.com/api/pandits/view'),
          fetch('https://backendserver-pf4h.onrender.com/api/services/view'),
        ]);

        const panditsData = await panditRes.json();
        const servicesData = await serviceRes.json();

        setPandits(panditsData.filter(p => p.is_verified));
        setServices(servicesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };
    fetchData();
  }, []);

  const heroBackground = process.env.PUBLIC_URL + '/images/ho1.png';

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/images/subh.png" alt="Logo" className="logo-circle" />
          <span className="logo-text">Shubhkarya</span>
        </div>
        <div className="navbar-right">
          <a href="#about">About Us</a>
          <a href="#services">Explore Services</a>
          <a href="#footer">Contact</a>
          <Link to="/login" className="login-box">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero" style={{ backgroundImage: `url(${heroBackground})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-left">
              <h1 className="main-heading">
                Shubhkarya:<br />
                Your Trusted Online<br />
                Pandit Booking
              </h1>
              <p className="tagline">Your Spiritual Partner: For Every Sacred Occasion</p>
              <div className="hero-buttons">
                <button className="book-btn" onClick={() => navigate('/login')}>Book Now</button>
                <button className="meet-btn" onClick={() => document.getElementById('pandits').scrollIntoView({ behavior: 'smooth' })}>Meet Our Pandits</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="about-section">
        <h2>About Shubhkarya</h2>
        <p>Discover the power of personalized puja services with Shubhkarya.</p>
        <div className="about-features">
          <div className="about-card">
            <img src="/images/subh.png" alt="Elegant Presentation" />
            <h3>Elegant Presentation</h3>
            <p>Our pandits present themselves with the utmost care and tradition.</p>
          </div>
          <div className="about-card">
            <img src="/images/subh.png" alt="Timeless Tradition" />
            <h3>Timeless Tradition</h3>
            <p>Preserving the rich heritage of Indian spirituality for generations.</p>
          </div>
          <div className="about-card">
            <img src="/images/subh.png" alt="Spiritual Expertise" />
            <h3>Spiritual Expertise</h3>
            <p>Our pandits possess deep knowledge of Vedic rituals and scriptures.</p>
          </div>
          <div className="about-card">
            <img src="/images/subh.png" alt="Personalized Service" />
            <h3>Personalized Service</h3>
            <p>Tailored pujas to suit your family’s unique religious needs.</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2>Explore Our Services</h2>
        <p>Discover the wide range of puja services available on Shubhkarya.</p>
        <div className="services-grid">
          {services.map(service => (
            <div key={service._id} className="service-card" onClick={() => navigate('/login')}>
              <div className="image-wrapper">
                <img src={service.image} alt={service.name} />
                <div className="overlay">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <button className="book-button">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="explore-more" onClick={() => navigate('/login')}>Explore More</button>
      </section>

      {/* Pandits Section */}
      <section id="pandits" className="pandits">
        <h2>Our Verified Pandits</h2>
        <div className="card-section">
          {pandits.map(pandit => (
            <div key={pandit._id} className="pandit-card">
              <img
                src={pandit.profile_photo_url.startsWith('/uploads')
                  ? `https://backendserver-pf4h.onrender.com${pandit.profile_photo_url}`
                  : pandit.profile_photo_url}
                alt={pandit.name}
              />
              <h3>{pandit.name}</h3>
              <p>{pandit.experience} years experience</p>
              <p>{pandit.language}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer">
        <p>&copy; 2025 Shubhkarya. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
