// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
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
              <a href="#services">Pooja</a>
              <a href="#pandits">Pandits</a>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Carousel */}
      <section className="hero-carousel">
        <div className="carousel-slide">
          <div className="slide" style={{ backgroundImage: `url('/images/ho1.png')` }}>
            <div className="slide-overlay">
              <h1>Book Panditji Online All Kinds of Pooja!!</h1>
              <p>We provide highly qualified Panditjee for all communities like Gujarati, Marathi, Sindhi, Bihari, Bengali and more.</p>
              <div className="slide-buttons">
                <button onClick={handleBooking}>Book Pandit</button>
                <Link to="/signup" className="hero-btn">Join as Devotee</Link>
                <Link to="/signup/pandit" className="hero-btn">Register as Pandit</Link>
              </div>
            </div>
          </div>
          <div className="slide" style={{ backgroundImage: `url('/images/ho2.png')` }}>
            <div className="slide-overlay">
              <h1>Your Spiritual Partner</h1>
              <p>Perform Pujas with ease, authenticity, and devotion — from your home or online.</p>
              <div className="slide-buttons">
                <button onClick={handleBooking}>Book Pandit</button>
                <Link to="/signup" className="hero-btn">Join as Devotee</Link>
                <Link to="/signup/pandit" className="hero-btn">Register as Pandit</Link>
              </div>
            </div>
          </div>
          <div className="slide" style={{ backgroundImage: `url('/images/ho3.png')` }}>
            <div className="slide-overlay">
              <h1>Trusted Vedic Rituals Across India</h1>
              <p>From Griha Pravesh to Navagraha — we’ve got every ritual covered with verified Pandits.</p>
              <div className="slide-buttons">
                <button onClick={handleBooking}>Book Pandit</button>
                <Link to="/signup" className="hero-btn">Join as Devotee</Link>
                <Link to="/signup/pandit" className="hero-btn">Register as Pandit</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Shubhkarya</h2>
        <p>
          Shubhkarya is India's 1st and most trusted online puja booking platform for Hindu rituals,
          Vedic ceremonies, and astrology services. We connect you with highly qualified and experienced
          Pandits and Shastris who can perform pujas at your home or online.<br />
          Our services also include puja samagri kits and temple bookings. From Shanti Vidhi to Shubh Vivah,<br />
          from Naamkaran to Navagraha Puja — we cover all major rituals and make your spiritual journey hassle-free.
        </p>
      </section>

      {/* Pooja Section */}
      <section id="services" className="services">
        <h2>Pooja Provided</h2>
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <div className="card-grid">
            {poojas.map(pooja => (
              <div className="service-card" key={pooja._id}>
                <img src={pooja.imageUrl || '/images/default-pooja.png'} alt={pooja.name} />
                <h3>{pooja.name}</h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pandits Section */}
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
                <img src={getPanditImage(p)} alt={p.name} />
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
          <p>7983078609</p>
          <p>info@shubhkarya.com</p>
          <p>32, Bhagwati Nagar, Chandrapuri Colony, Mathura 281001</p>
        </div>
        <div className="footer-right">
          <h3>Connect with Us</h3>
          <form onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Your Email" />
            <label><input type="checkbox" /> Subscribe to Shubhkarya</label>
            <button type="submit">Subscribe</button>
          </form>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
