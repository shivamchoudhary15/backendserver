import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from 'lucide-react'; // Lucide React icons for a modern look
import "./Home.css";
// Assuming 'postLocation' is a utility function in api.js/api.ts
import { postLocation } from '../api/api'; 

// Centralize backend URL for easy updates
const backendURL = "http://localhost:5000";

// Helper to construct image URLs, providing a default fallback
const getImageUrl = (path) => {
  if (!path) return "/images/default-pooja.png"; // Ensure you have a default image
  return path.startsWith("http://") || path.startsWith("https://") ? path : `${backendURL}${path}`;
};

const Home = () => {
  // State management for various data and UI elements
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPooja, setSelectedPooja] = useState(null); // Renamed for clarity (Pooja modal)
  const [showChatbot, setShowChatbot] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchHovered, setIsSearchHovered] = useState(false); // Renamed for clarity

  const navigate = useNavigate(); // React Router hook for programmatic navigation

  // Effect to fetch initial data from the backend APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [panditRes, poojaRes, serviceRes] = await Promise.all([
          axios.get(`${backendURL}/api/pandits/view`),
          axios.get(`${backendURL}/api/poojas/view`),
          axios.get(`${backendURL}/api/services/view`),
        ]);
        // Filter for verified pandits and set data
        setPandits(panditRes.data?.filter((p) => p.is_verified) || []);
        setPoojas(poojaRes.data || []);
        setServices(serviceRes.data || []);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        // Ensure states are empty arrays on error to prevent render issues
        setPandits([]);
        setPoojas([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Runs once on component mount

  // Effect for continuous geolocation tracking and posting
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }

    let watchId;

    const geoSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      // console.log(`Location updated: Lat ${latitude}, Lon ${longitude}`); // For debugging
      postLocation({ latitude, longitude }).catch((err) =>
        console.error("Failed to post location:", err)
      );
    };

    const geoError = (err) => {
      console.warn(`Geolocation error (${err.code}): ${err.message}`);
      // Specific error handling can be added here (e.g., showing a message to the user)
    };

    // Start watching position with high accuracy and no cached data
    watchId = navigator.geolocation.watchPosition(geoSuccess, geoError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    });

    // Cleanup function to clear the watch when component unmounts
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        // console.log("Geolocation watch cleared.");
      }
    };
  }, []); // Runs once on component mount

  // Memoized filtered poojas based on search query for performance
  const filteredPoojas = useCallback(
    poojas.filter((pooja) =>
      pooja.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [poojas, searchQuery]
  );

  // Animation variants for Framer Motion to reuse
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-left">
          <motion.img
            src="/images/subh.png"
            alt="Shubhkarya Logo"
            className="logo-circle"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <span className="logo-text">Shubhkarya</span>
        </div>
        <div className="navbar-right">
          <a href="#about">About Us</a>
          <a href="#services">Services</a>
          <a href="#poojas">Pooja Provided</a>
          <a href="#pandits">Pandits</a>
          <a href="#contact">Contact</a> {/* Updated href for consistency */}
          <Link to="/login" className="login-box">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero" style={{ backgroundImage: `url(/images/ho1.png)` }}>
        <div className="hero-overlay">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="hero-left">
              <h1 className="main-heading">
                Shubhkarya:<br />
                Your Trusted Online<br />
                Pandit Booking
              </h1>
              <p className="tagline">Your Spiritual Partner: For Every Sacred Occasion</p>
              <div className="hero-buttons">
                <motion.button
                  className="book-btn"
                  onClick={() => navigate('/login')}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(214, 127, 42, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Now
                </motion.button>
                <motion.button
                  className="get-started-btn"
                  onClick={() => navigate('/signup')}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* About Us Section */}
      <section className="about-section" id="about">
        <motion.h2
          className="section-title"
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          About Shubkarya
        </motion.h2>
        <div className="about-content">
          <motion.div
            className="about-column"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {[
              { img: "/images/i1.jpeg", title: "Vedic Poojas", desc: "Performed by experienced Pandits with authentic rituals." },
              { img: "/images/i2.jpeg", title: "Easy Booking", desc: "Book poojas anytime with a few simple clicks." },
              { img: "/images/i4.jpeg", title: "Verified Pandits", desc: "Only trusted and verified professionals available." },
            ].map((feature, i) => (
              <div className="feature-row" key={i}>
                <img src={feature.img} alt={feature.title} />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
          <div className="logo-center">
            <img src="/images/subh.png" alt="Shubhkarya Logo" />
          </div>
          <motion.div
            className="about-column"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            {[
              { img: "/images/i6.jpeg", title: "Traditional Rituals", desc: "Rooted in ancient Vedic traditions and customs." },
              { img: "/images/i5.jpeg", title: "Multiple Services", desc: "From Griha Pravesh to Wedding, all covered." },
              { img: "/images/i3.jpeg", title: "24x7 Support", desc: "We’re here to help you anytime, anywhere." },
            ].map((feature, i) => (
              <div className="feature-row" key={i}>
                <img src={feature.img} alt={feature.title} />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="services-container" id="services">
        <motion.h2
          initial={{ scale: 0.7, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          OUR SERVICES
        </motion.h2>
        <p style={{ textAlign: "center" }}>Discover a wide range of spiritual services tailored to your needs.</p>
        <div className="services-grid">
          {services.map((service, i) => (
            <motion.div
              key={service._id}
              className="service-card"
              onClick={() => navigate('/login')}
              whileHover={{ scale: 1.07, boxShadow: "0 8px 28px #ffc10744" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.35 }}
            >
              <img src={service.image} alt={service.name} className="service-image" />
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button className="book-now">Book Now</button>
            </motion.div>
          ))}
        </div>
        {/* Service details grid (4000+ Spiritual Guides, etc.) */}
        <motion.div className="service-details-grid"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="detail-item">
            <img src="/images/s1.png" alt="Spiritual Guide Icon" className="detail-icon" />
            <h4>4000+ Spiritual Guide</h4>
            <p>Priests, Pandits, Religious Experts & Consultants</p>
          </div>
          <div className="detail-item">
            <img src="/images/s2.png" alt="Pooja Types Icon" className="detail-icon" />
            <h4>500+ Types of Puja</h4>
            <p>500+ Types of Religious Services</p>
          </div>
          <div className="detail-item">
            <img src="/images/s3.png" alt="Pooja Performed Icon" className="detail-icon" />
            <h4>100000+ Puja Performed</h4>
            <p>4000+ Spiritual Guides performed more than 100000+ Puja</p>
          </div>
        </motion.div>
      </section>

      {/* Pooja Provided Section (Enhanced) */}
      <section id="poojas" className="poojas-section">
        <div className="poojas-header-wrapper">
          <h2>Pooja Provided</h2>
          <motion.div
            className="pooja-search-wrapper"
            onMouseEnter={() => setIsSearchHovered(true)}
            onMouseLeave={() => setIsSearchHovered(false)}
            layout
            transition={{ duration: 0.4, type: "spring", damping: 20, stiffness: 200 }}
          >
            <motion.div
              className="search-pooja-icon"
              initial={false}
              animate={{
                scale: isSearchHovered ? 1.15 : 1,
                rotate: isSearchHovered ? 20 : 0,
                backgroundColor: isSearchHovered ? 'rgba(255, 197, 85, 0.4)' : '#fff',
                boxShadow: isSearchHovered ? '0 8px 25px rgba(214, 127, 42, 0.4)' : '0 4px 15px rgba(214, 127, 42, 0.2)',
              }}
              transition={{ duration: 0.3 }}
            >
              <Search size={28} />
            </motion.div>

            <AnimatePresence>
              {isSearchHovered && (
                <motion.div
                  className="pooja-search-bar"
                  initial={{ width: 0, opacity: 0, x: -20, padding: '0 5px' }}
                  animate={{ width: '400px', opacity: 1, x: 0, padding: '0 15px' }}
                  exit={{ width: 0, opacity: 0, x: -20, padding: '0 5px' }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <input
                    type="text"
                    placeholder="Search for a Pooja..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pooja-search-input"
                    autoFocus
                    aria-label="Search for a Pooja"
                  />
                  <Search size={24} className="search-input-icon" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {loading ? (
          <p className="loading-message">Loading poojas...</p>
        ) : (
          <motion.div
            className="pooja-card-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {filteredPoojas.length > 0 ? (
              filteredPoojas.map((pooja) => (
                <motion.div
                  className="pooja-item-card"
                  key={pooja._id}
                  onClick={() => setSelectedPooja(pooja)}
                  whileHover={{ scale: 1.05, boxShadow: "0 12px 36px rgba(255, 167, 38, 0.25)" }}
                  whileTap={{ scale: 0.98 }}
                  variants={cardVariants}
                >
                  <h3>{pooja.name}</h3> {/* Pooja name now above image */}
                  <img
                    src={getImageUrl(pooja.imageUrl)}
                    alt={pooja.name}
                    className="pooja-item-image"
                  />
                </motion.div>
              ))
            ) : (
              <p className="no-results-message">No Poojas found matching your search.</p>
            )}
          </motion.div>
        )}

        {/* Pooja Description Modal */}
        <AnimatePresence>
          {selectedPooja && (
            <motion.div
              className="pooja-description-overlay"
              onClick={() => setSelectedPooja(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="pooja-description-modal"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.25 }}
                role="dialog"
                aria-modal="true"
                aria-label={`${selectedPooja.name} Details`}
              >
                <h3>{selectedPooja.name}</h3>
                <img
                  src={getImageUrl(selectedPooja.imageUrl)}
                  alt={selectedPooja.name}
                  className="modal-pooja-image"
                />
                <p>{selectedPooja.description}</p>
                <button onClick={() => setSelectedPooja(null)} className="close-btn">
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Pandits Section */}
      <section id="pandits" className="pandits-section">
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Our Verified Pandits
        </motion.h2>
        <motion.div
          className="pandits-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {pandits.map((pandit) => (
            <motion.div
              className="pandit-card-item"
              key={pandit._id}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(237, 172, 17, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              variants={cardVariants}
            >
              <img
                src={getImageUrl(pandit.profile_photo_url)}
                alt={`Profile of ${pandit.name}`}
                className="pandit-profile-image"
              />
              <h3>{pandit.name}</h3>
              <p>{pandit.experience} years experience</p>
              <p>{pandit.language}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Enhanced Footer Section */}
      <footer className="footer" id="contact">
        <div className="footer-content">
          <div className="footer-section footer-about">
            <div className="footer-logo-area">
              <img src="/images/subh.png" alt="Shubhkarya Logo" className="footer-logo" />
              <span className="footer-company-name">Shubhkarya</span>
            </div>
            <p className="footer-description">
              Shubhkarya is your trusted online platform for booking experienced Pandits and
              performing authentic Vedic Poojas. We ensure a seamless spiritual experience
              for every sacred occasion, bringing ancient traditions to your doorstep.
            </p>
            <p className="footer-copyright">&copy; {new Date().getFullYear()} Shubhkarya. All rights reserved.</p>
          </div>

          <div className="footer-section footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Our Services</a></li>
              <li><a href="#poojas">Pooja Types</a></li>
              <li><a href="#pandits">Our Pandits</a></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-section footer-contact">
            <h3>Contact Us</h3>
            <p><i className="fas fa-phone-alt"></i> Mobile: +91 98765 43210</p>
            <p><i className="fas fa-envelope"></i> Email: info@shubhkarya.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Address: 123 Divine Path, Spiritual Nagar, Hathras, Uttar Pradesh, India - 204101</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Toggle Button */}
      <motion.button
        className="chatbot-toggle-button"
        onClick={() => setShowChatbot(!showChatbot)}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle Chatbot"
      >
        <img src="/images/subh.png" alt="Chatbot Icon" className="chatbot-icon" />
      </motion.button>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            className="chatbot-popup"
            role="dialog"
            aria-modal="true"
            aria-label="Chatbot window"
            initial={{ opacity: 0, y: 50, x: 50 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <iframe
              title="Chatbot"
              src="https://www.chatbase.co/chatbot-iframe/usovl2iS71gPfrO5xmRyP"
              style={{ width: "100%", height: "100%", border: "none", borderRadius: 15 }}
              allow="clipboard-write" // Added clipboard-write permission
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
