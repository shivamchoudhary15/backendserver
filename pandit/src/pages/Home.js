// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [panditRes, poojaRes] = await Promise.all([
          fetch('https://backendserver-pf4h.onrender.com/api/pandits/view'),
          fetch('https://backendserver-pf4h.onrender.com/api/poojas/view'),
        ]);
        const panditsData = await panditRes.json();
        const poojasData = await poojaRes.json();

        const verifiedPandits = panditsData.filter(p => p.is_verified);
        setPandits(verifiedPandits);
        setPoojas(poojasData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBooking = () => {
    if (token) navigate('/booking');
    else {
      alert('Please login');
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <div className="navbar-wrapper">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-left">
              <img src="/images/subh.png" alt="logo" className="logo-img" />
              <div className="logo">Shubhkarya</div>
            </div>
            <div className="navbar-center">
              Your Spiritual Partner: For Every Sacred Occasion
            </div>
            <div className="navbar-right nav-links">
              <a href="#about">About us</a>
              <a href="#services">Pooja</a>
              <a href="#pandits">Pandits</a>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <header
        className="hero"
        style={{
          backgroundImage: `url('/images/babaji.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="hero-overlay">
          <div className="hero-text">
            <h1>Welcome to Shubhkarya</h1>
            <p>Find Your Trusted Pandit Online</p>
            <button onClick={handleBooking}>Explore Services</button>
            <div className="hero-buttons">
              <Link to="/signup" className="hero-btn">Join as Devotee</Link>
              <Link to="/signup/pandit" className="hero-btn">Register for Pandit</Link>
            </div>
          </div>
        </div>
      </header>

      {/* About */}
      <section id="about" className="about">
        <h2>About Shubhkarya</h2>
        <p>Your one-stop spiritual platform to book experienced Pandits for all Hindu rituals and poojas.</p>
      </section>

      {/* Pooja Section */}
      <section id="services" className="services">
        <h2>Pooja Provided</h2>
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <div className="card-grid">
            {poojas.map(pooja => (
              <div className="service-card" key={pooja._id} onClick={() => setSelectedService(pooja)}>
                <img src={pooja.imageUrl || '/images/default-pooja.png'} alt={pooja.name} />
                <h3>{pooja.name}</h3>
              </div>
            ))}
          </div>
        )}
        {selectedService && (
          <div className="service-description">
            <h3>{selectedService.name}</h3>
            <p>{selectedService.description}</p>
            <button onClick={() => setSelectedService(null)}>Close</button>
          </div>
        )}
      </section>

      {/* Pandits */}
      <section id="pandits" className="pandits">
        <h2>Meet Our Pandits</h2>
        {loading ? (
          <p>Loading pandits...</p>
        ) : pandits.length === 0 ? (
          <p>No verified pandits available.</p>
        ) : (
          <div className="pandit-grid">
            {pandits.map(p => (
              <div className="pandit-card" key={p._id}>
                <img
                  src={p.profile_photo_url || '/images/default-pandit.png'}
                  alt={`Photo of ${p.name}`}
                />
                <h4>{p.name}</h4>
                <p>{p.city} | {p.experienceYears}+ yrs</p>
                <p>🗣 {Array.isArray(p.languages) ? p.languages.join(', ') : p.languages}</p>
                <p>🎯 {Array.isArray(p.specialties) ? p.specialties.join(', ') : p.specialties}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <h2>Shubhkarya</h2>
          <p>123-456-7890</p>
          <p>info@shubhkarya.com</p>
          <p>500 Terry Francine St, San Francisco, CA 94158</p>
        </div>
        <div className="footer-right">
          <h3>Connect with Us</h3>
          <form onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Your Email" />
            <label><input type="checkbox" /> Subscribe to newsletter</label>
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-links">
            <a href="#">Privacy Policy</a> | <a href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
