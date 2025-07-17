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

  const heroBackground = process.env.PUBLIC_URL + '/images/ho1.png';

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/images/subh.png" alt="Logo" className="logo-circle" />
          <span className="logo-text">Shubhkarya</span>
        </div>
        <div className="navbar-right">
          <a href="#about">About Us</a>
          <a href="#order">Explore Services</a>
          <a href="#footer" className="contact-link">Contact</a>
          <Link to="/login" className="login-box">Login</Link>
        </div>
      </nav>

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
                <button className="meet-btn" onClick={() => navigate('#pandits')}>Meet Our Pandits</button>
              </div>
            </div>
          </div>
        </div>
      </header>

<section id="about" className="about-section">
  <h2>About Shubhkarya</h2>
  <p>Discover the power of personalized puja services with Shubhkarya.</p>
  <div className="about-columns">
    <div className="about-column">
      <div className="about-item">
        <img src="/images/subh.png" alt="Icon" className="about-icon" />
        <div>
          <h4>Exclusive Gifts</h4>
          <p>Treat your loved ones with carefully curated spiritual gifts.</p>
        </div>
      </div>
      <div className="about-item">
        <img src="/images/subh.png" alt="Icon" className="about-icon" />
        <div>
          <h4>Serene Offerings</h4>
          <p>Immerse yourself in peaceful Vedic rituals guided by experts.</p>
        </div>
      </div>
      <div className="about-item">
        <img src="/images/subh.png" alt="Icon" className="about-icon" />
        <div>
          <h4>Timeless Traditions</h4>
          <p>Embrace centuries of wisdom and sacred practice.</p>
        </div>
      </div>
    </div>

    <div className="portrait">
      <img src="/images/subh.png" alt="Pandit Illustration" />
    </div>

    <div className="about-column">
      <div className="about-item">
        <img src="/images/subh.png" alt="Icon" className="about-icon" />
        <div>
          <h4>Trusted Partners</h4>
          <p>Collaborations with reputed spiritual organizations.</p>
        </div>
      </div>
      <div className="about-item">
        <img src="/images/subh.png" alt="Icon" className="about-icon" />
        <div>
          <h4>Inspiring Profiles</h4>
          <p>Explore verified and experienced Pandits across regions.</p>
        </div>
      </div>
      <div className="about-item">
        <img src="/images/subh.png" alt="Icon" className="about-icon" />
        <div>
          <h4>Personalized</h4>
          <p>Tailored rituals to meet your spiritual needs.</p>
        </div>
      </div>
    </div>
  </div>
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

      <footer className="footer" id="footer">
        <p>&copy; 2025 Shubhkarya. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
