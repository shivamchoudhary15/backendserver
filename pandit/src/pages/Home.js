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
    fetch('https://backendserver-6-yebf.onrender.com/api/pandits/view')
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
      {/* Header Section */}
      <div
        className="hero-section"
        style={{
          backgroundImage: "url('/images/ho1.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="navbar-wrapper">
          <nav className="navbar">
            <div className="logo">
              <img src="/images/subh.png" alt="Subh Logo" className="logo-img" />
              <span className="logo-text">Shubhkarya</span>
            </div>
            <div className="nav-links">
              <a href="#about">About Us</a>
              <a href="#pandits">Pandits</a>
              <a href="#poojas">Pooja</a>
              <span onClick={scrollToFooter} style={{ cursor: 'pointer' }}>Contact</span>
              <Link to="/login" className="login-btn">Login</Link>
            </div>
          </nav>
        </div>

        <div className="hero-content">
          <h1 className="main-heading">Shubhkarya:<br />Your Trusted Online Pandit Booking</h1>
          <p className="sub-heading">Your Spiritual Partner: For Every Sacred Occasion</p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/login')} className="book-btn">Book Now</button>
            <span className="meet-text">Meet Our Pandits</span>
          </div>
        </div>
      </div>

      {/* About Shubhkarya Section */}
      <section id="about" className="about-section">
        <h2>About Shubhkarya</h2>
        <p>Discover the power of personalized puja services with Shubhkarya</p>
        <div className="about-icons">
          <div className="about-item">
            <img src="/icons/exclusive-gifts.png" alt="Exclusive Gifts Icon" />
            <h3>Exclusive Gifts</h3>
            <p>Treat yourself or your loved ones with our carefully curated</p>
          </div>
          <div className="about-item">
            <img src="/icons/serene-offerings.png" alt="Serene Offerings Icon" />
            <h3>Serene Offerings</h3>
            <p>Immerse yourself in the beauty of nature's blessings</p>
          </div>
          <div className="about-item">
            <img src="/icons/timeless-tradition.png" alt="Timeless Tradition Icon" />
            <h3>Timeless Tradition</h3>
            <p>Embrace the timeless wisdom of Vedic practices with Shubhkarya</p>
          </div>
          <div className="about-item">
            <img src="/icons/trusted-partners.png" alt="Trusted Partners Icon" />
            <h3>Trusted Partners</h3>
            <p>Shubhkarya collaborates with renowned organizations and</p>
          </div>
          <div className="about-item">
            <img src="/icons/inspiring-profiles.png" alt="Inspiring Profiles Icon" />
            <h3>Inspiring Profiles</h3>
            <p>Discover the remarkable stories and expertise of our Shubhkarya</p>
          </div>
          <div className="about-item">
            <img src="/icons/personalized.png" alt="Personalized Icon" />
            <h3>Personalized</h3>
            <p>Let our experienced pandits be your trusted companions</p>
          </div>
        </div>
      </section>

      {/* Pooja Section */}
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

      {/* Pandit Section */}
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

      {/* Footer */}
      <footer ref={footerRef} id="footer" className="footer">
        <p>Contact us at support@shubkarya.in</p>
        <p>&copy; 2025 Shubkarya. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
