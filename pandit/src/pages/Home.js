import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./Home.css";

const backendURL = "https://backendserver-dryq.onrender.com";

function getPoojaImage(img) {
  if (!img) return "/images/default-pooja.png";
  if (img.startsWith("http://") || img.startsWith("https://")) return img;
  return `${backendURL}${img}`;
}

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [panditRes, poojaRes, serviceRes] = await Promise.all([
          axios.get(`${backendURL}/api/pandits/view`),
          axios.get(`${backendURL}/api/poojas/view`),
          axios.get(`${backendURL}/api/services/view`),
        ]);
        setPandits((panditRes.data || []).filter((p) => p.is_verified));
        setPoojas(poojaRes.data || []);
        setServices(serviceRes.data || []);
      } catch {
        setPandits([]);
        setPoojas([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <motion.img src="/images/subh.png" alt="Logo" className="logo-circle"
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}
          />
          <span className="logo-text">Shubhkarya</span>
        </div>
        <div className="navbar-right">
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#poojas">Pooja Provided</a>
          <a href="#pandits">Pandits</a>
          <a href="#footer">Contact</a>
          <Link to="/login" className="login-box">Login</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" style={{ backgroundImage: `url(/images/ho1.png)` }}>
        <div className="hero-overlay">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          >
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
          </motion.div>
        </div>
      </header>

      {/* About */}
      <section className="about-section" id="about">
        <motion.h2 className="section-title"
          initial={{ x: -150, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >About Shubkarya</motion.h2>
        <div className="about-content">
          <motion.div className="about-column" initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}>
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
          </motion.div>
          <div className="logo-center">
            <img src="/images/subh.png" alt="Shubkarya Logo" />
          </div>
          <motion.div className="about-column" initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}>
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
          </motion.div>
        </div>
      </section>

      {/* OUR SERVICES */}
      <section className="services-container" id="services">
        <motion.h2
          initial={{ scale: 0.7, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >OUR SERVICES</motion.h2>
        <p style={{ textAlign: "center" }}>Discover a wide range of spiritual services tailored to your needs.</p>
        <div className="services-grid">
          {services.map((service, i) => (
            <motion.div
              key={service._id}
              className="service-card"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.07, boxShadow: "0 8px 28px #ffc10744" }}
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <img src={service.image} alt={service.name} className="service-image" />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button className="book-now">Book Now</button>
            </motion.div>
          ))}
        </div>
        <motion.div className="service-details"
          initial={{ y: 60, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <h4>4000+ Spiritual Guides</h4>
          <p>Priests, Pandits, Religious Experts & Consultants</p>
          <h4>500+ Types of Puja</h4>
          <p>Comprehensive coverage of religious services</p>
          <h4>100000+ Pujas Performed</h4>
          <p>Trusted by thousands across India</p>
        </motion.div>
      </section>

      {/* Pooja Provided */}
      <section id="poojas" className="poojas">
        <h2>Pooja Provided</h2>
        {loading ? (
          <p>Loading poojas...</p>
        ) : (
          <motion.div className="card-grid" initial="hidden" animate="visible" variants={{
            visible: { transition: { staggerChildren: 0.08 } }
          }}>
            {poojas.map((pooja, i) => (
              <motion.div
                className="service-card"
                key={pooja._id}
                onClick={() => setSelectedService(pooja)}
                whileHover={{ scale: 1.07, boxShadow: "0 8px 32px #ffa72640" }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 + 0.2, duration: 0.32 }}
              >
                <img
                  src={getPoojaImage(pooja.imageUrl)}
                  alt={pooja.name}
                  className="service-img"
                />
                <h3>{pooja.name}</h3>
              </motion.div>
            ))}
          </motion.div>
        )}
        <AnimatePresence>
          {selectedService && (
            <motion.div className="service-description-overlay"
              onClick={() => setSelectedService(null)}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="service-description-modal"
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h3>{selectedService.name}</h3>
                <img
                  src={getPoojaImage(selectedService.imageUrl)}
                  alt={selectedService.name}
                  style={{ width: "100%", marginBottom: 12, borderRadius: 6 }}
                />
                <p>{selectedService.description}</p>
                <button onClick={() => setSelectedService(null)} className="close-btn">Close</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Pandits */}
      <section id="pandits" className="pandits">
        <h2>Our Verified Pandits</h2>
        <motion.div className="card-section"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {pandits.map((pandit, i) => (
            <motion.div
              className="pandit-card"
              key={pandit._id}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.29 }}
            >
              <img
                src={
                  pandit.profile_photo_url &&
                  pandit.profile_photo_url.startsWith("/uploads")
                    ? `${backendURL}${pandit.profile_photo_url}`
                    : pandit.profile_photo_url
                }
                alt={pandit.name}
              />
              <h3>{pandit.name}</h3>
              <p>{pandit.experience} years experience</p>
              <p>{pandit.language}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer" id="footer">
        <p>&copy; 2025 Shubhkarya. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
