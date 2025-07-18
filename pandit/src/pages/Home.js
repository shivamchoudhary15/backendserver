// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

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
          <a href="#pandits">Meet Our Pandits</a>
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
                <button className="get-started-btn" onClick={() => navigate('/signup')}>Get Started</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section className="about-section" id="about">
        <h2 className="section-title">About Shubkarya</h2>
        <div className="about-content">
          <div className="about-column">
            <div className="feature-row">
              <img src="/images/i1.jpeg" alt="Pooja Icon" />
              <div>
                <h3>Vedic Poojas</h3>
                <p>Performed by experienced Pandits with authentic rituals.</p>
              </div>
            </div>
            <div className="feature-row">
              <img src="/images/i2.jpeg" alt="Calendar Icon" />
              <div>
                <h3>Easy Booking</h3>
                <p>Book poojas anytime with a few simple clicks.</p>
              </div>
            </div>
            <div className="feature-row">
              <img src="/images/i4.jpeg" alt="Verified Icon" />
              <div>
                <h3>Verified Pandits</h3>
                <p>Only trusted and verified professionals available.</p>
              </div>
            </div>
          </div>

          <div className="logo-center">
            <img src="/images/subh.png" alt="Shubkarya Logo" />
          </div>

          <div className="about-column">
            <div className="feature-row">
              <img src="/images/i6.jpeg" alt="Blessings Icon" />
              <div>
                <h3>Traditional Rituals</h3>
                <p>Rooted in ancient Vedic traditions and customs.</p>
              </div>
            </div>
            <div className="feature-row">
              <img src="/images/i5.jpeg" alt="Services Icon" />
              <div>
                <h3>Multiple Services</h3>
                <p>From Griha Pravesh to Wedding, all covered.</p>
              </div>
            </div>
            <div className="feature-row">
              <img src="/images/i3.jpeg" alt="Support Icon" />
              <div>
                <h3>24x7 Support</h3>
                <p>We’re here to help you anytime, anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Services Section */}
      <section className="services-container" id="services" data-aos="fade-up">
        <h2>OUR SERVICES</h2>
        <p style={{ textAlign: 'center' }}>Discover a wide range of spiritual services tailored to your needs.</p>

        <div className="services-grid">
          {services.map(service => (
            <div key={service._id} className="service-card" data-aos="fade-up" onClick={() => navigate('/login')}>
              <img
                src={service.image}
                alt={service.name}
                className="service-image"
              />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button className="book-now">Book Now</button>
            </div>
          ))}
        </div>

        <div className="service-details">
          <h4>4000+ Spiritual Guides</h4>
          <p>Priests, Pandits, Religious Experts & Consultants</p>
          <h4>500+ Types of Puja</h4>
          <p>Comprehensive coverage of religious services</p>
          <h4>100000+ Pujas Performed</h4>
          <p>Trusted by thousands across India</p>
        </div>
      </section>

      {/* Pandits Section */}
      <section id="pandits" className="pandits" data-aos="fade-up">
        <h2>Our Verified Pandits</h2>
        <div className="card-section">
          {pandits.map(pandit => (
            <div key={pandit._id} className="pandit-card" data-aos="zoom-in">
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
