import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getServices } from '../api/api';
import './Home.css';

const dummyPandits = [
  {
    name: 'Pt. Ravi Shastri',
    city: 'Varanasi',
    experienceYears: 10,
    languages: ['Hindi', 'Sanskrit'],
    specialties: ['Griha Pravesh', 'Satyanarayan Puja'],
    profile_photo_url: '/images/pandit1.png',
  },
  {
    name: 'Pt. Manoj Tripathi',
    city: 'Delhi',
    experienceYears: 8,
    languages: ['Hindi', 'English'],
    specialties: ['Lakshmi Puja', 'Navagraha Shanti'],
    profile_photo_url: '/images/pandit2.png',
  },
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch(() => setServices(dummyServices));
  }, []);

  const handleBooking = () => {
    if (token) navigate('/booking');
    else {
      alert('Please login first.');
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">🕉️ Shubkarya</div>
        <div className="nav-links">
          <a href="#about">About Us</a>
          <a href="#services">Pooja Provided</a>
          <a href="#pandits">Meet Our Pandits</a>
          <Link to="/signup">Join as Devotee</Link>
          <Link to="/signup/pandit">Register as Pandit</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-text">
          <h1>Explore the Spiritual World</h1>
          <p>Book Pandits for all your sacred occasions</p>
          <button onClick={handleBooking}>Book a Pandit</button>
        </div>
        <img src="/images/download.jpeg" alt="hero" className="hero-img" />
      </header>

      {/* About Section */}
      <section id="about" className="about">
        <h2>About Shubkarya</h2>
        <p>
          Shubkarya is your one-stop spiritual platform to book experienced Pandits for
          all types of Hindu rituals and poojas.
        </p>
      </section>

      {/* Services / Pooja Section */}
      <section id="services" className="services">
        <h2>Pooja Provided</h2>
        <div className="card-grid">
          {(services.length ? services : dummyServices).map((service, idx) => (
            <div
              className="service-card"
              key={idx}
              onClick={() => setSelectedService(service)}
            >
              <img
                src={poojaImageMap[service.name] || dummyImages[idx % dummyImages.length]}
                alt={service.name}
              />
              <h3>{service.name}</h3>
            </div>
          ))}
        </div>

        {selectedService && (
          <div className="service-description">
            <h3>{selectedService.name}</h3>
            <p>{selectedService.description || 'This Pooja brings peace and prosperity.'}</p>
            <button onClick={() => setSelectedService(null)}>Close</button>
          </div>
        )}
      </section>

      {/* Pandit Section */}
      <section id="pandits" className="pandits">
        <h2>Meet Our Pandits</h2>
        <div className="pandit-grid">
          {dummyPandits.map((pandit, idx) => (
            <div className="pandit-card" key={idx}>
              <img src={pandit.profile_photo_url} alt={pandit.name} />
              <h4>{pandit.name}</h4>
              <p>{pandit.city} | {pandit.experienceYears}+ yrs exp</p>
              <p>🗣 {pandit.languages.join(', ')}</p>
              <p>🎯 {pandit.specialties.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const dummyServices = [
  { name: 'Ganesh Puja', description: 'Removes obstacles and ensures success.' },
  { name: 'Satyanarayan Katha', description: 'For prosperity and blessings in life.' },
  { name: 'Navagraha Shanti', description: 'Balances planetary influences.' },
  { name: 'Griha Pravesh', description: 'Performed before entering a new home.' },
  { name: 'Rudra Abhishek', description: 'Puja of Lord Shiva for inner peace.' },
  { name: 'Lakshmi Puja', description: 'Invokes wealth and abundance.' },
];

const dummyImages = [
  'https://pujabooking.com/wp-content/uploads/2017/07/ganesh-puja.jpg',
  'https://media.prayagpandits.com/media/2023/05/19161549/Satyanarayan-Pooja.webp',
  'https://kashidham.in/wp-content/uploads/2024/03/navgrah-shanti.jpg',
  'https://www.gharjunction.com/img/blog/68.jpg',
  'https://shivology.com/img/article-image-589.jpg',
  'https://resources.mypandit.com/wp-content/uploads/2024/11/Laxmi-Puja_3.webp',
];

const poojaImageMap = {
  'Ganesh Puja': dummyImages[0],
  'Satyanarayan Katha': dummyImages[1],
  'Navagraha Shanti': dummyImages[2],
  'Griha Pravesh': dummyImages[3],
  'Rudra Abhishek': dummyImages[4],
  'Lakshmi Puja': dummyImages[5],
};

export default Home;
