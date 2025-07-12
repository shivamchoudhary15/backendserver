// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const dummyImages = [
  'https://pujabooking.com/wp-content/uploads/2017/07/ganesh-puja.jpg',
  'https://media.prayagpandits.com/media/2023/05/19161549/Satyanarayan-Pooja.webp',
  'https://kashidham.in/wp-content/uploads/2024/03/navgrah-shanti.jpg',
  'https://www.gharjunction.com/img/blog/68.jpg',
  'https://shivology.com/img/article-image-589.jpg',
  'https://resources.mypandit.com/wp-content/uploads/2024/11/Laxmi-Puja_3.webp',
];

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
          fetch('https://backendserver-auhk.onrender.com/api/pandits/view'),
          fetch('https://backendserver-auhk.onrender.com/api/poojas/view'),
        ]);
        const panditsData = await panditRes.json();
        const poojasData = await poojaRes.json();

        setPandits(panditsData);
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
    if (token) {
      navigate('/booking');
    } else {
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
            <div className="navbar-center">Your Spiritual Partner: For Every Sacred Occasion</div>
            <div className="navbar-right nav-links">
              <a href="#about">About us</a>
              <a href="#services">Pooja</a>
              <a href="#pandits">Pandits</a>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <header
        className="hero"
        style={{
          backgroundImage: `url('/images/babaji.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Shubhkarya</h2>
        <p>
          Your one-stop spiritual platform to book experienced Pandits for all Hindu rituals and poojas.
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <h2>Pooja Provided</h2>
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <div className="card-grid">
            {poojas.map((pooja, idx) => (
              <div
                className="service-card"
                key={pooja._id || idx}
                onClick={() => setSelectedService(pooja)}
              >
                <img
                  src={pooja.imageUrl || dummyImages[idx % dummyImages.length]}
                  alt={pooja.name}
                />
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

      {/* Pandits Section */}
      <section id="pandits" className="pandits">
        <h2>Meet Our Pandits</h2>
        {loading ? (
          <p>Loading pandits...</p>
        ) : (
          <div className="pandit-grid">
            {pandits.map((p, idx) => (
              <div className="pandit-card" key={p._id || idx}>
                <img
                  src={p.profile_photo_url || '/images/default-pandit.png'}
                  alt={`Photo of ${p.name}`}
                />
                <h4>{p.name}</h4>
                <p>{p.city} | {p.experienceYears}+ yrs exp</p>
                <p>🗣 {Array.isArray(p.languages) ? p.languages.join(', ') : p.languages || 'N/A'}</p>
                <p>🎯 {Array.isArray(p.specialties) ? p.specialties.join(', ') : p.specialties || 'N/A'}</p>
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
          <p>500 Terry Francine St,<br />San Francisco, CA 94158</p>
        </div>
        <div className="footer-right">
          <h3>Connect with Us</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your Email" />
            <label>
              <input type="checkbox" /> Subscribe to newsletter
            </label>
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
