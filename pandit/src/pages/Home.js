import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      try {
        // Fetch all data parallel
        const [panditRes, poojaRes, serviceRes] = await Promise.all([
          fetch(`${backendURL}/api/pandits/view`),
          fetch(`${backendURL}/api/poojas/view`),
          fetch(`${backendURL}/api/services/view`),
        ]);
        const panditsData = await panditRes.json();
        const poojasData = await poojaRes.json();
        const servicesData = await serviceRes.json();

        setPandits(panditsData.filter((p) => p.is_verified));
        setPoojas(poojasData);
        setServices(servicesData);
      } catch (e) {
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
          <img src="/images/subh.png" alt="Logo" className="logo-circle" />
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

      {/* About */}
      <section className="about-section" id="about">
        <h2 className="section-title">About Shubkarya</h2>
        <div className="about-content">
          <div className="about-column">
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
          </div>
          <div className="logo-center">
            <img src="/images/subh.png" alt="Shubkarya Logo" />
          </div>
          <div className="about-column">
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
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services" id="services">
        <h2>OUR SERVICES</h2>
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <div className="services-grid">
            {services.map(service => (
              <div className="service-card" key={service._id}>
                <img src={service.image} alt={service.name} className="service-img" />
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* === Pooja Provided Section === */}
      <section id="poojas" className="poojas">
        <h2>Pooja Provided</h2>
        {loading ? (
          <p>Loading poojas...</p>
        ) : (
          <div className="card-grid">
            {poojas.map((pooja) => (
              <div
                className="service-card"
                key={pooja._id}
                onClick={() => setSelectedService(pooja)}
              >
                <img
                  src={getPoojaImage(pooja.imageUrl)}
                  alt={pooja.name}
                  className="service-img"
                />
                <h3>{pooja.name}</h3>
              </div>
            ))}
          </div>
        )}

        {selectedService && (
          <div className="service-description-overlay" onClick={() => setSelectedService(null)}>
            <div className="service-description-modal" onClick={e => e.stopPropagation()}>
              <h3>{selectedService.name}</h3>
              <img
                src={getPoojaImage(selectedService.imageUrl)}
                alt={selectedService.name}
                style={{ width: "100%", marginBottom: 12, borderRadius: 6 }}
              />
              <p>{selectedService.description}</p>
              <button onClick={() => setSelectedService(null)} className="close-btn">
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Pandits */}
      <section id="pandits" className="pandits">
        <h2>Our Verified Pandits</h2>
        <div className="card-section">
          {pandits.map((pandit) => (
            <div className="pandit-card" key={pandit._id}>
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
