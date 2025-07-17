import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

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
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getPanditImage = (pandit) => {
    if (pandit.profile_photo_url) {
      return pandit.profile_photo_url.startsWith('/uploads')
        ? `https://backendserver-pf4h.onrender.com${pandit.profile_photo_url}`
        : pandit.profile_photo_url;
    }
    return '/images/default-pandit.png';
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-left">
              <img src="/images/subh.png" alt="Shubhkarya logo" className="logo-img" />
              <div className="logo">Shubhkarya</div>
            </div>
            <div className="navbar-center">
              Your Spiritual Partner: For Every Sacred Occasion
            </div>
            <div className="navbar-right nav-links">
              <a href="#about">About us</a>
              <a href="#order">Order Services</a>
              <a href="#services">Pooja</a>
              <a href="#pandits">Pandits</a>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <header className="hero-custom">
        <div className="hero-content-custom">
          <div className="hero-left">
            <h1>Shubkarya: Your Trusted Online Pandit Booking</h1>
            <p>
              Welcome to Shubkarya, where you can easily book puja services, explore a wide range
              of pandit profiles, and enjoy a seamless booking experience.
            </p>
            <div className="hero-buttons">
              <button className="login-btn" onClick={() => navigate('/login')}>Login</button>
              <Link to="/signup" className="hero-btn">Join as Devotee</Link>
              <Link to="/signup/pandit" className="hero-btn">Register as Pandit</Link>
            </div>
          </div>
          <div className="hero-right">
            <img src="/images/hero-pandit.png" alt="Pandit" />
          </div>
        </div>
      </header>

      {/* About */}
      <section id="about" className="about">
        <h2>About Shubhkarya</h2>
        <p> /* ... original about content ... */ </p>
      </section>

      {/* Order Services */}
      <section id="order" className="service-boxes">
        <h2 className="section-title">Our Services</h2>
        <div className="card-section">
          {services.length > 0 ? services.map(s => (
            <div
              key={s._id}
              className="highlight-card"
              style={{ backgroundImage: `url(${s.image})` }}
            >
              <div className="highlight-overlay">
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <p>₹{s.price}</p>
                <button onClick={() => navigate('/login')}>Book Now</button>
              </div>
            </div>
          )) : <p>No services available.</p>}
        </div>
      </section>

      {/* Pooja Section */}
      <section id="services" className="services">
        {/* ... existing pooja section ... */}
      </section>

      {/* Pandits Section */}
      <section id="pandits" className="pandits">
        {/* ... existing pandits section ... */}
      </section>

      {/* Footer */}
      <footer className="footer">
        {/* ... existing footer ... */}
      </footer>
    </div>
  );
};

export default Home;
