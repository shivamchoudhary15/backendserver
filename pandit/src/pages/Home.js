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

      {/* Hero */}
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

      <section className="about-section" id="about">
  <h2 className="section-title">About Shubkarya</h2>
  <div className="about-content">
    <div className="about-column">
      <div className="feature">
        <img src="/images/pooja.png" alt="Pooja Icon" />
        <h3><b>Vedic Poojas</b></h3>
        <p>Performed by experienced and certified Pandits.</p>
      </div>
      <div className="feature">
        <img src="/images/calendar.png" alt="Calendar Icon" />
        <h3><b>Easy Booking</b></h3>
        <p>Book your pooja in just a few clicks.</p>
      </div>
      <div className="feature">
        <img src="/images/verified.png" alt="Verified Icon" />
        <h3><b>Verified Pandits</b></h3>
        <p>Only trusted and background-checked Pandits.</p>
      </div>
    </div>

    <div className="logo-center">
      <img src="/images/subh.png" alt="Shubkarya Logo" />
    </div>

    <div className="about-column">
      <div className="feature">
        <img src="/images/blessings.png" alt="Blessing Icon" />
        <h3><b>Traditional Rituals</b></h3>
        <p>Authentic practices as per Hindu scriptures.</p>
      </div>
      <div className="feature">
        <img src="/images/service.png" alt="Service Icon" />
        <h3><b>Multiple Services</b></h3>
        <p>Choose from a wide range of spiritual services.</p>
      </div>
      <div className="feature">
        <img src="/images/support.png" alt="Support Icon" />
        <h3><b>24x7 Support</b></h3>
        <p>Assistance available at every step of your journey.</p>
      </div>
    </div>
  </div>
</section>


      {/* Services */}
      <section id="services" className="services-section" data-aos="fade-up">
        <h2>Explore Our Services</h2>
        <p>Discover the wide range of puja services available on Shubhkarya.</p>
        <div className="services-grid">
          {services.map(service => (
            <div key={service._id} className="service-card" onClick={() => navigate('/login')} data-aos="fade-up">
              <div className="image-wrapper">
                <img src={service.image} alt={service.name} />
                <div className="overlay">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <button className="book-button-small">Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="explore-more" onClick={() => navigate('/login')}>Explore More</button>
      </section>

      {/* Pandits */}
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
