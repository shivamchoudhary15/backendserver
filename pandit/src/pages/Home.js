import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { getPoojas, getVerifiedPandits } from '../api/api';

const Home = () => {
  const [poojas, setPoojas] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  const heroImages = [
    '/images/ho1.png',
    '/images/ho2.png',
    '/images/ho3.png'
  ];

  useEffect(() => {
    const fetchData = async () => {
      const poojaData = await getPoojas();
      const panditData = await getVerifiedPandits();
      setPoojas(poojaData);
      setPandits(panditData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleBooking = () => {
    navigate('/login');
  };

  const getPanditImage = (pandit) => {
    return pandit.imageUrl || '/images/default-pandit.jpg';
  };

  return (
    <div className="home-container">
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${heroImages[currentImage]})` }}
      >
        <div className="hero-overlay">
          <h1>Welcome to Shubhkarya</h1>
          <p>Find verified Pandits for all your religious needs</p>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </section>

      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>
          Shubhkarya is your one-stop platform to book verified pandits, perform spiritual poojas, and access astrology services — all from the comfort of your home. Our mission is to preserve the sanctity of Indian rituals while making them accessible, organized, and meaningful.
        </p>
      </section>

      <section id="order" className="services-section">
        <h2>Our Services</h2>
        <div className="cards-wrapper">
          <div className="service-card">
            <img src="/images/service-pooja.png" alt="Pooja" />
            <h3>Pooja Services</h3>
            <p>Book specific poojas with authentic rituals and experienced pandits.</p>
            <button onClick={handleBooking}>Book Now</button>
          </div>
          <div className="service-card">
            <img src="/images/service-temple.png" alt="Temple" />
            <h3>Temple Services</h3>
            <p>Connect with nearby temples for offerings, donations, and special events.</p>
            <button onClick={handleBooking}>Book Now</button>
          </div>
          <div className="service-card">
            <img src="/images/service-astro.png" alt="Astrology" />
            <h3>Astrology</h3>
            <p>Get personalized astrology reports and consultations from experts.</p>
            <button onClick={handleBooking}>Book Now</button>
          </div>
        </div>
      </section>

      <section id="services" className="pooja-section">
        <h2>Available Poojas</h2>
        <div className="cards-wrapper">
          {poojas.map((pooja, idx) => (
            <div key={idx} className="pooja-card">
              <h3>{pooja.name}</h3>
              <p>{pooja.description}</p>
              <p>₹{pooja.price}</p>
              <button onClick={handleBooking}>Book Now</button>
            </div>
          ))}
        </div>
      </section>

      <section id="pandits" className="pandits-section">
        <h2>Verified Pandits</h2>
        <div className="cards-wrapper">
          {pandits.map((pandit, idx) => (
            <div key={idx} className="pandit-card">
              <img src={getPanditImage(pandit)} alt={pandit.name} />
              <h3>{pandit.name}</h3>
              <p>{pandit.experience}+ years experience</p>
              <p>Language: {pandit.language}</p>
              <button onClick={handleBooking}>Book Now</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Shubhkarya. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
