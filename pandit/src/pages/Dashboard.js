import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';

import { createReview, getBookings, getVerifiedPandits } from '../api/api';

const navItems = [
  { label: 'Home', icon: '🏠', path: '/' },
  { label: 'Book New Puja', icon: '📅', path: '/booking' },
  { label: 'Submit Review', icon: '💬', path: '#review' },
  { label: 'View Our Pandit', icon: '🧑‍🦳', path: '#pandit' },
  { label: 'Search for Puja', icon: '🔍', path: '#highlight' },
  { label: 'Booking History', icon: '📅', path: '#booking' },
  { label: 'Logout', icon: '🚪', path: '/home', logout: true }
];

const sliderImages = [
  '/images/i2.jpeg',
  '/images/kalash.jpeg',
  '/images/havan.jpeg',
  '/images/i3.jpeg',
  '/images/i1.jpeg',
];

function StarRating({ rating, onChange }) {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          tabIndex={0}
          className={i <= rating ? 'star active' : 'star'}
          aria-label={`${i} star`}
          onClick={() => onChange(i)}
          onKeyDown={e => ['Enter', ' '].includes(e.key) && onChange(i)}
          role="button"
        >⭐</span>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [isNavbarOpen, setNavbarOpen] = useState(false);

  const [review, setReview] = useState({ name: '', rating: 0, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [visiblePandits, setVisiblePandits] = useState(3);
  const [searchPandits, setSearchPandits] = useState('');
  const [searchBookings, setSearchBookings] = useState('');
  const [expandedPandits, setExpandedPandits] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) return navigate('/login');
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'admin') return navigate('/admin');
      if (parsedUser.role === 'pandit') return navigate('/pandit/dashboard');
      setUser(parsedUser);
      setReview(prev => ({ ...prev, name: parsedUser.name }));
      getBookings({ userid: parsedUser._id }).then(res => setBookings(res.data));
      getVerifiedPandits().then(res => setPandits(res.data));
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const intv = setInterval(() => setCarouselIndex(i => (i + 1) % sliderImages.length), 4000);
    return () => clearInterval(intv);
  }, []);

  const handleNavClick = (item) => {
    if (item.logout) {
      localStorage.clear();
      navigate(item.path);
      return;
    }
    if (String(item.path).startsWith('#')) {
      const section = document.querySelector(item.path);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      setNavbarOpen(false);
    } else navigate(item.path);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!review.name || !review.comment || !review.rating) {
      setReviewMessage('Please fill all fields and give a star rating.');
      return;
    }
    setReviewLoading(true);
    try {
      await createReview(review);
      setReviewMessage('Review submitted!');
      setReview({ name: review.name, rating: 0, comment: '' });
    } catch {
      setReviewMessage('Failed to submit review.');
    } finally {
      setReviewLoading(false);
      setTimeout(() => setReviewMessage(''), 2800);
    }
  };

  const getStatusClass = (status) => ({
    accepted: 'status accepted',
    rejected: 'status rejected',
    pending: 'status pending'
  }[(status || '').toLowerCase()] || 'status');

  const filteredPandits = pandits.filter(p =>
    p.name?.toLowerCase().includes(searchPandits.toLowerCase()) ||
    (p.city || '').toLowerCase().includes(searchPandits.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => {
    const q = searchBookings.toLowerCase();
    return (
      (b.panditid?.name || '').toLowerCase().includes(q) ||
      (b.serviceid?.name || '').toLowerCase().includes(q) ||
      new Date(b.puja_date).toLocaleDateString().includes(q)
    );
  });

  const toggleExpand = id => setExpandedPandits(p => ({ ...p, [id]: !p[id] }));

  return (
    <div className="dashboard-root">
      {/* NAVBAR */}
      <nav
        className={`dashboard-navbar${isNavbarOpen ? ' open' : ''}`}
        onMouseEnter={() => setNavbarOpen(true)}
        onMouseLeave={() => setNavbarOpen(false)}
      >
        <div className="navbar-brand">
          <img src="/images/subh.png" alt="Logo" className="navbar-logo" />
          <span className="brand-accent neon-text">Shubhkarya</span>
          <span className="navbar-expand-icon">{isNavbarOpen ? '▲' : '▼'}</span>
        </div>
        <AnimatePresence>
          {isNavbarOpen &&
            <motion.ul
              className="navbar-menu"
              role="menu"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.21 }}
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.label}
                  className={`navbar-menu-item${item.logout ? ' logout' : ''}`}
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => handleNavClick(item)}
                  onKeyDown={e => ['Enter', ' '].includes(e.key) && handleNavClick(item)}
                  whileHover={{ scale: 1.045 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {item.label}
                </motion.li>
              ))}
            </motion.ul>
          }
        </AnimatePresence>
      </nav>

      {/* WELCOME BANNER */}
      {user && (
        <div className="welcome-banner nice-glass" data-aos="fade">
          <h2>
            Welcome, <span>{user.name}</span>!
          </h2>
          <p>May your every puja bring joy and prosperity.</p>
        </div>
      )}

      {/* HERO / SLIDER */}
      <section className="hero-section gradient-hero" id="dashboard" data-aos="fade-down">
        <div className="hero-container">
          <div className="hero-content">
            <h1>
              Book Trusted Pandits with <span className="primary">Shubhkarya</span>
            </h1>
            <p>
              Your dedicated portal for <b>pujas, havans, and ceremonies</b> with experienced and verified experts.<br />
              Browse, book, and experience auspicious bliss from anywhere.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/booking')}>
                📅 Book New Puja
              </button>
            </div>
          </div>
          <div className="hero-visual" data-aos="zoom-in">
            <div className="slider-frame">
              <img src={sliderImages[carouselIndex % sliderImages.length]} alt="Hero Visual" />
              <div className="slider-dots">
                {sliderImages.map((_, i) => (
                  <button
                    key={i}
                    className={`slider-dot${i === carouselIndex % sliderImages.length ? " active" : ""}`}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setCarouselIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS SECTION */}
      <section id="highlight" className="stats-section" data-aos="fade-up">
        <div className="stats-container">
          <div className="stat-card glass">
            🥇
            <span className="stat-title">Verified Pandits</span>
            <span className="stat-value">250+</span>
          </div>
          <div className="stat-card glass">
            📖
            <span className="stat-title">Pujas Performed</span>
            <span className="stat-value">1,000+</span>
          </div>
          <div className="stat-card glass">
            👪
            <span className="stat-title">Happy Families</span>
            <span className="stat-value">800+</span>
          </div>
        </div>
      </section>

      {/* WHY SHUBHKARYA */}
      <section className="why-section nice-glass" data-aos="fade-up">
        <h3>
          Why <span className="brand-accent">Shubhkarya?</span>
        </h3>
        <div className="why-row">
          <div className="why-block">
            ✅ Verified Pandits
          </div>
          <div className="why-block">
            🌏 Pan India Support
          </div>
          <div className="why-block">
            💸 Fixed Pricing
          </div>
        </div>
        <div className="offer-banner">
          🎁 Festive Offer! <span className="offer-main">₹50 OFF</span> on first puja <span className="offer-code">[SHUBH50]</span>
        </div>
      </section>

      {/* PANDIT SHOWCASE */}
      <section id="pandit" className="pandit-section" data-aos="fade-up">
        <div className="section-title-row">
          <h3>Verified Pandits</h3>
          <div className="search-pandit-input">
            🔍
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchPandits}
              onChange={e => setSearchPandits(e.target.value)}
              aria-label="Search pandits"
            />
          </div>
        </div>
        <div className="pandit-list">
          {filteredPandits.slice(0, visiblePandits).map(p => (
            <motion.div
              key={p._id}
              className="pandit-card glass"
              whileHover={{ y: -4, scale: 1.03 }}
            >
              <div
                className="pandit-avatar"
                style={{
                  backgroundImage: `url(${p.profile_photo_url || '/images/i1.jpeg'})`
                }}
                title={p.name}
                tabIndex={0}
                aria-label={"Pandit: " + p.name}
                onClick={() => toggleExpand(p._id)}
              >
                🧑‍🦳
              </div>
              <div className="pandit-content">
                <div className="pandit-header">
                  <span className="pandit-name">{p.name}</span>
                  <span className="pandit-city">
                    📍 {p.city}
                  </span>
                </div>
                {expandedPandits[p._id] && (
                  <div className="pandit-extra-info">
                    <div className="pandit-badge">Exp: {p.experienceYears} Years</div>
                    <div className="pandit-badge">{(p.languages || []).join(', ')}</div>
                    <div className="pandit-specials">
                      <b>Specialties:</b> {p.specialties?.join(', ')}
                    </div>
                  </div>
                )}
              </div>
              <button className="expand-btn" onClick={() => toggleExpand(p._id)}>
                {expandedPandits[p._id] ? '➖' : '➕'}
              </button>
            </motion.div>
          ))}
        </div>
        {filteredPandits.length > 3 && (
          <div style={{ textAlign: "center" }}>
            <button className="btn-secondary" onClick={() => setVisiblePandits(v => v === 3 ? filteredPandits.length : 3)}>
              {visiblePandits === 3 ? 'Show More' : 'Show Less'}
            </button>
          </div>
        )}
      </section>

      {/* BOOKINGS */}
      <section id="booking" className="bookings-section glass" data-aos="fade-up">
        <div className="section-title-row">
          <h3>Your Bookings</h3>
          <div className="search-booking-input">
            🔍
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchBookings}
              onChange={e => setSearchBookings(e.target.value)}
              aria-label="Search bookings"
            />
          </div>
        </div>
        <div className="booking-list">
          {filteredBookings.length === 0 ? (
            <p className="empty-msg">No bookings found.</p>
          ) : filteredBookings.map(b => (
            <motion.div
              key={b._id}
              className="booking-card glass"
              whileHover={{ scale: 1.025 }}
            >
              <div className="booking-main">
                <div className="booking-header">
                  📅
                  <div>
                    <div className="booking-type">{b.serviceid?.name}</div>
                    <div className="booking-date">⏰ {new Date(b.puja_date).toLocaleDateString()} {b.puja_time}</div>
                  </div>
                </div>
                <div className="booking-details">
                  <span>🧑‍🦳 {b.panditid?.name || 'N/A'}</span>
                  <span>📍 {b.location}</span>
                  <span className={`${getStatusClass(b.status)}`}>{b.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* REVIEW */}
      <section id="review" className="review-section glass" data-aos="fade-up">
        <h3>Leave a Review</h3>
        {reviewMessage && (
          <p className={reviewMessage.includes('submitted') ? 'msg-success' : 'msg-error'}>
            {reviewMessage}
          </p>
        )}
        <form className="review-form" onSubmit={handleReviewSubmit}>
          <div className="review-row">
            <input className="review-input" type="text" value={review.name} disabled placeholder="Your Name" />
            <StarRating
              rating={review.rating}
              onChange={v => setReview(prev => ({ ...prev, rating: v }))}
            />
          </div>
          <textarea
            required
            className="review-textarea"
            placeholder="Write your feedback..."
            value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
          />
          <button className="btn-primary" type="submit" disabled={reviewLoading}>
            {reviewLoading ? 'Submitting...' : <>Submit 💬</>}
          </button>
        </form>
      </section>

      {/* CHATBOT BUTTON */}
      <button className="chatbot-toggle" onClick={() => setShowChatbot(s => !s)} aria-label="Open Chatbot">
        {showChatbot ? '✖️' : <img src="/images/subh.png" alt="Chatbot" style={{ width: 38, borderRadius: '50%' }} />}
      </button>
      {showChatbot && (
        <div className="chatbot-popup">
          <iframe
            title="Chatbot"
            src="https://www.chatbase.co/chatbot-iframe/usovl2iS71gPfrO5xmRyP"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 18
            }}
            allow="clipboard-write"
          />
        </div>
      )}
    </div>
  );
}
