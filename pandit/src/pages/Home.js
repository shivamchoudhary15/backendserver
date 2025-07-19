import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [panditRes, poojaRes, serviceRes] = await Promise.all([
          fetch('https://backendserver-dryq.onrender.com/api/pandits/view'),
          fetch('https://backendserver-dryq.onrender.com/api/poojas/view'),
          fetch('https://backendserver-dryq.onrender.com/api/services/view'),
        ]);
        const panditsData = await panditRes.json();
        const poojasData = await poojaRes.json();
        const servicesData = await serviceRes.json();

        setPandits(panditsData.filter(p => p.is_verified));
        setPoojas(poojasData);
        setServices(servicesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
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
          <a href="#poojas">Our Poojas</a>
          <a href="#pandits">Meet Our Pandits</a>
          <a href="#footer">Contact</a>
          <Link to="/login" className="login-box">Login</Link>
        </div>
      </nav>

      {/* Hero, About, Services... (same as previous code) */}

      {/* Services Section */}
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

      {/* Poojas Section */}
      <section id="poojas" className="poojas" data-aos="fade-up">
        <h2>Our Poojas</h2>
        <div className="card-section">
          {loading && <p>Loading Poojas...</p>}
          {!loading && poojas.length === 0 && <p>No poojas available right now.</p>}
          {poojas.map(pooja => (
            <div key={pooja._id} className="pooja-card" data-aos="zoom-in">
              <img
                src={
                  pooja.image && pooja.image.startsWith('/uploads')
                    ? `https://backendserver-dryq.onrender.com${pooja.image}`
                    : pooja.image
                }
                alt={pooja.name}
              />
              <h3>{pooja.name}</h3>
              {pooja.description && <p>{pooja.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Pandits Section */}
      <section id="pandits" className="pandits" data-aos="fade-up">
        <h2>Our Verified Pandits</h2>
        <div className="card-section">
          {pandits.map(pandit => (
            <div key={pandit._id} className="pandit-card" data-aos="zoom-in">
              <img
                src={
                  pandit.profile_photo_url.startsWith('/uploads')
                    ? `https://backendserver-dryq.onrender.com${pandit.profile_photo_url}`
                    : pandit.profile_photo_url
                }
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
