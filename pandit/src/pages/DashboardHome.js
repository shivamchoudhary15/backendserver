// src/pages/DashboardHome.js
import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import icons

const upcomingFestivals = [
  { name: "Raksha Bandhan", date: "2025-08-19", description: "A celebration of sibling love." },
  { name: "Janmashtami", date: "2025-08-26", description: "Birth of Lord Krishna." },
  { name: "Ganesh Chaturthi", date: "2025-09-06", description: "Arrival of Lord Ganesha." },
  { name: "Navratri", date: "2025-09-26", description: "Nine nights of devotion to Goddess Durga." },
  { name: "Dussehra", date: "2025-10-06", description: "Celebration of victory of good over evil." },
];

export default function DashboardHome() {
  const { user, carouselIndex, sliderImages, poojaListRef, scrollList, navigate } = useOutletContext();

  const getUpcomingFestivals = () => {
    const today = new Date();
    return upcomingFestivals.filter(festival => new Date(festival.date) >= today).sort((a,b) => new Date(a.date) - new Date(b.date));
  };

  return (
    <>
      {/* Hero & Slider */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Experience{" "}
            <span className="hero-highlight">Auspicious Rituals</span> with{" "}
            <span className="hero-brand-white">Shubhkarya</span>
          </h1>
          <p className="hero-subtitle">
            Welcome{user?.name && <span>, <b>{user.name}</b></span>}!
            <br />
            Book trusted Pandits for your{" "}
            <span style={{ color: "#fcd75a", fontWeight: 600 }}>
              pujas, havans, and ceremonies
            </span>{" "}
            with elegance and ease.
            <br />
            Now enhanced with same-day bookings and instant chat support.
          </p>
          <div className="hero-actions">
            <button className="main-cta-btn" onClick={() => navigate("/dashboard/booking")}>
              Book Puja Now
            </button>
            <button
              className="main-alt-btn"
              onClick={() => navigate("/dashboard/search-pandits")}
            >
              Browse Pandits
            </button>
          </div>
        </div>
        <div className="slider-wrapper">
          <div className="carousel-frame hero-slider-bg">
            <img
              src={sliderImages[carouselIndex]}
              alt={`Slide ${carouselIndex + 1}`}
              loading="lazy"
            />
            <div className="carousel-dots">
              {sliderImages.map((_, i) => (
                <button
                  key={i}
                  className={`carousel-dot${carouselIndex === i ? " active" : ""}`}
                  onClick={() => { /* No direct control from here, auto-slides */ }}
                  aria-selected={carouselIndex === i}
                  role="tab"
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <div className="slider-caption">
              <div>
                Find <span style={{ color: "#fcd75a" }}>expert guidance</span> for every ritual
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="dashboard-features">
        <div className="feature-card">
          <h3>Live Chat Support</h3>
          <p>Ask spiritual or booking questions to our team – instant help, 7am to 10pm.</p>
        </div>
        <div className="feature-card">
          <h3>Preferred Pandit Booking</h3>
          <p>Save favorite Pandits, see their next available slots, and book with just one tap.</p>
        </div>
        <div className="feature-card">
          <h3>Festive Offers</h3>
          <p>Special discounts and promo codes for all major festivals and family events.</p>
        </div>
      </section>

      {/* Upcoming Festivals */}
      <section className="festivals-section horizontal-carousel-section" tabIndex={-1} aria-label="Upcoming Festivals">
        <div className="section-header">
          <h3 className="section-heading highlighted-heading">Upcoming Festivals</h3>
          <div className="carousel-controls">
            <button
              aria-label="Scroll festivals left"
              onClick={() => scrollList(poojaListRef, "left")}
              className="carousel-arrow-btn"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              aria-label="Scroll festivals right"
              onClick={() => scrollList(poojaListRef, "right")}
              className="carousel-arrow-btn"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
        <div className="festival-list horizontal-scroll" ref={poojaListRef} tabIndex={0}>
          {getUpcomingFestivals().length === 0 ? (
            <p className="empty-msg">No upcoming festivals planned yet. Check back soon!</p>
          ) : (
            getUpcomingFestivals().map((festival, index) => (
              <motion.div
                key={index}
                className="festival-card neon-card glass-highlight glossy shadow-pop horizontal-card"
                whileHover={{ y: -4, scale: 1.04 }}
                tabIndex={0}
              >
                <h4 className="festival-name">🎉 {festival.name}</h4>
                <p className="festival-date">🗓️ {new Date(festival.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="festival-description">{festival.description}</p>
                <button className="book-festival-btn custom-btn glow-btn" onClick={() => navigate(`/dashboard/booking?festival=${encodeURIComponent(festival.name)}`)}>
                  Explore Pujas
                </button>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
