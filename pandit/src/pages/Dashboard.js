import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';

const navbarItems = [
  { label: 'Home', icon: '🏠', goto: '/' },
  { label: 'Book New Puja', icon: '🛕', goto: '/booking' },
  { label: 'Submit Review', icon: '💬', goto: '#review' },
  { label: 'View Our Pandit', icon: '📿', goto: '#pandit' },
  { label: 'Search for Puja', icon: '🔍', goto: '#highlight' },
  { label: 'Booking History', icon: '📅', goto: '#booking' },
  { label: 'Logout', icon: '🚪', goto: '/home', logout: true },
];

const sliderImages = [
  '/images/i2.jpeg',
  '/images/kalash.jpeg',
  '/images/havan.jpeg',
  '/images/i3.jpeg',
  '/images/i1.jpeg',
];

// StarRating component with keyboard & screen reader accessibility
function StarRating({ rating, onChange }) {
  return (
    <div className="star-rating" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          role="button"
          tabIndex={0}
          className={`star ${i <= rating ? 'active' : ''}`}
          aria-label={`Give ${i} star${i > 1 ? 's' : ''}`}
          onClick={() => onChange(i)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onChange(i)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visiblePandits, setVisiblePandits] = useState(3);
  const [expandedPandits, setExpandedPandits] = useState({});
  const [searchPandits, setSearchPandits] = useState('');
  const [searchBookings, setSearchBookings] = useState('');

  const [review, setReview] = useState({ name: '', rating: 0, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [showChatbot, setShowChatbot] = useState(false);

  // Init on mount, fetch user, bookings and pandits
  useEffect(() => {
    AOS.init({ duration: 750, once: true });
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) return navigate('/login');
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'admin') return navigate('/admin');
      if (parsedUser.role === 'pandit') return navigate('/pandit/dashboard');
      setUser(parsedUser);
      setReview(r => ({ ...r, name: parsedUser.name }));

      // Fetch bookings and verified pandits asynchronously
      getBookings({ userid: parsedUser._id }).then(res => setBookings(res.data || []));
      getVerifiedPandits().then(res => setPandits(res.data || []));
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  // Auto-carousel logic: cycle images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(i => (i + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Nav handler: routes or scrolls or logout
  function handleNavClick(item) {
    if (item.logout) {
      localStorage.clear();
      navigate(item.goto);
    } else if (String(item.goto).startsWith('#')) {
      const section = document.querySelector(item.goto);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      setIsNavbarOpen(false);
    } else {
      navigate(item.goto);
    }
  }

  // Review form submit
  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!review.name || !review.comment.trim() || !review.rating) {
      setReviewMessage('Please complete all fields and provide star rating.');
      return;
    }
    setReviewLoading(true);
    try {
      await createReview(review);
      setReviewMessage('Thank you for your review!');
      setReview(r => ({ name: r.name, rating: 0, comment: '' }));
    } catch {
      setReviewMessage('Failed to submit review.');
    } finally {
      setReviewLoading(false);
      setTimeout(() => setReviewMessage(''), 2500);
    }
  }

  // Toggle expand/collapse of pandits details
  function toggleExpand(id) {
    setExpandedPandits(prev => ({ ...prev, [id]: !prev[id] }));
  }

  // Booking status CSS class helper
  const getStatusClass = status =>
    ({
      accepted: 'status accepted',
      rejected: 'status rejected',
      pending: 'status pending',
    }[(status || '').toLowerCase()] || 'status');

  // Filter pandits for search
  const filteredPandits = pandits.filter(
    p =>
      p.name.toLowerCase().includes(searchPandits.toLowerCase()) ||
      (p.city || '').toLowerCase().includes(searchPandits.toLowerCase())
  );

  // Filter bookings for search
  const filteredBookings = bookings.filter(b => {
    const q = searchBookings.toLowerCase();
    return (
      (b.panditid?.name || '').toLowerCase().includes(q) ||
      (b.serviceid?.name || '').toLowerCase().includes(q) ||
      new Date(b.puja_date).toLocaleDateString().includes(q)
    );
  });

  return (
    <div className="dashboard-root">
      {/* NAVBAR */}
      <nav
        className={`dashboard-navbar${isNavbarOpen ? ' open' : ''}`}
        aria-label="Main Navigation"
        onMouseEnter={() => setIsNavbarOpen(true)}
        onMouseLeave={() => setIsNavbarOpen(false)}
      >
        <div className="navbar-brand" tabIndex={0} role="button" onClick={() => setIsNavbarOpen(!isNavbarOpen)} onKeyDown={e => ['Enter', ' '].includes(e.key) && setIsNavbarOpen(!isNavbarOpen)} aria-expanded={isNavbarOpen} aria-controls="nav-menu">
          <img src="/images/subh.png" alt="Shubhkarya logo" className="navbar-logo" />
          <span className="brand-accent neon-text">Shubhkarya</span>
          <span className="navbar-expand-icon" aria-hidden="true">{isNavbarOpen ? '▲' : '▼'}</span>
        </div>
        <AnimatePresence>
          {isNavbarOpen && (
            <motion.ul
              className="navbar-menu"
              role="menu"
              id="nav-menu"
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {navbarItems.map(item => (
                <motion.li
                  key={item.label}
                  role="menuitem"
                  tabIndex={0}
                  className={`navbar-menu-item${item.logout ? ' logout' : ''}`}
                  onClick={() => handleNavClick(item)}
                  onKeyDown={e => ['Enter', ' '].includes(e.key) && handleNavClick(item)}
                  whileHover={{ scale: 1.07 }}
                  whileTap={{ scale: 0.98 }}
                  aria-label={item.label}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  {item.label}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>

      {/* WELCOME BANNER */}
      {user && (
        <section className="welcome-banner nice-glass" data-aos="fade" aria-live="polite" aria-atomic="true">
          <h2>
            Welcome, <span>{user.name}</span>!
          </h2>
          <p>May your every puja bring joy and prosperity.</p>
        </section>
      )}

      {/* HERO + SLIDER */}
      <section className="dashboard-hero gradient-hero" id="dashboard" data-aos="fade-down" aria-label="Booking hero section">
        <div className="hero-main-row">
          <div>
            <h1 className="hero-title hero-text-glow" tabIndex={0}>
              Book Trusted Pandits with <span>Shubhkarya</span>
            </h1>
            <p className="hero-desc" tabIndex={0}>
              Your dedicated portal for <b>pujas, havans, and ceremonies</b> with experienced and verified experts.<br />
              Browse, book, and experience auspicious bliss from anywhere.
            </p>
            <button
              className="hero-book-btn glow-btn"
              onClick={() => navigate('/booking')}
              aria-label="Book a new Puja"
              type="button"
            >
              🛕 Book New Puja
            </button>
          </div>
          <div className="hero-slider slider-glow" data-aos="zoom-in" aria-label="Image slider">
            <div className="slider-frame shadow-pop">
              <img src={sliderImages[carouselIndex]} alt="Spiritual ceremonial offering" />
              <div className="slider-dots" role="tablist" aria-label="Select slideshow image">
                {sliderImages.map((_, i) => (
                  <button
                    key={i}
                    className={`slider-dot${i === carouselIndex ? ' active' : ''}`}
                    aria-label={`Select slide ${i + 1}`}
                    role="tab"
                    aria-selected={i === carouselIndex}
                    tabIndex={i === carouselIndex ? 0 : -1}
                    onClick={() => setCarouselIndex(i)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setCarouselIndex(i)}
                    type="button"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section id="highlight" className="highlight-section" data-aos="fade-up" aria-label="Platform highlights" tabIndex={-1}>
        <div className="highlight-card glass-highlight theme1" style={{ backgroundImage: "url('/images/india.jpeg')" }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <span role="img" aria-label="Verified" style={{ fontSize: '2em' }}>✔️</span>
            <h4>Spiritual Guides</h4>
            <p>Pandits & Consultants across India</p>
            <p>250+ Experts</p>
          </div>
        </div>
        <div className="highlight-card glass-highlight theme2" style={{ backgroundImage: "url('/images/kalash.jpeg')" }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <span role="img" aria-label="Temple" style={{ fontSize: '2em' }}>🛕</span>
            <h4>Religious Services</h4>
            <p>Wide variety of pujas</p>
            <p>100+ Pujas</p>
          </div>
        </div>
        <div className="highlight-card glass-highlight theme3" style={{ backgroundImage: "url('/images/havan.jpeg')" }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <span role="img" aria-label="Calendar" style={{ fontSize: '1.7em' }}>📆</span>
            <h4>Pujas Done</h4>
            <p>Performed by verified pandits</p>
            <p>1,000+ Completed</p>
          </div>
        </div>
      </section>

      {/* WHY SHUBHKARYA */}
      <section className="why-shubhkarya-section nice-glass" data-aos="fade-up" aria-label="Why choose Shubhkarya" tabIndex={-1}>
        <h3>
          Why Choose <span className="brand-accent">Shubhkarya?</span>
        </h3>
        <div className="why-cards-row">
          <div className="why-card neon-card" tabIndex={0}>
            <div className="why-icon glow-icon">✅</div>
            <div>
              <h5>Verified Pandits</h5>
              <p>Background-checked and reviewed experts at your service.</p>
            </div>
          </div>
          <div className="why-card neon-card" tabIndex={0}>
            <div className="why-icon glow-icon">🌏</div>
            <div>
              <h5>Pan India Support</h5>
              <p>Metro & local experts available in all states.</p>
            </div>
          </div>
          <div className="why-card neon-card" tabIndex={0}>
            <div className="why-icon glow-icon">💰</div>
            <div>
              <h5>Transparent Pricing</h5>
              <p>No hidden charges, clear billing, and fair policies.</p>
            </div>
          </div>
          <div className="why-card neon-card" tabIndex={0}>
            <div className="why-icon glow-icon">🔆</div>
            <div>
              <h5>Choose by Tradition</h5>
              <p>Select by tradition, date, or preferred language.</p>
            </div>
          </div>
        </div>

        <div className="improved-offer animated-pop-offer offer-gradient-glass" aria-label="Festive Offer">
          <span className="promo-gift" role="img" aria-label="Gift" style={{ fontSize: '2.1em' }}>🎁</span>
          <div className="offer-content">
            <b>Festive Offer!</b>
            <span>
              Get <span className="offer-amt">₹50 OFF</span> your first puja <span className="offer-code">(code: <b>SHUBH50</b>)</span>
            </span>
          </div>
        </div>
      </section>

      {/* PANDIT SHOWCASE */}
      <section id="pandit" className="pandit-section" data-aos="fade-up" tabIndex={-1} aria-label="Verified Pandits">
        <h3 className="section-heading">Verified Pandits</h3>
        <input
          type="text"
          className="booking-search"
          aria-label="Search pandits"
          placeholder="Search by name or city..."
          value={searchPandits}
          onChange={e => setSearchPandits(e.target.value)}
          autoComplete="off"
        />
        <div className="pandit-list" aria-live="polite" aria-relevant="additions removals">
          {filteredPandits.slice(0, visiblePandits).map(pandit => (
            <motion.div
              key={pandit._id}
              className="improved-pandit-card neon-card glass-highlight glossy shadow-pop"
              whileHover={{ y: -4, scale: 1.04 }}
              tabIndex={0}
              aria-expanded={!!expandedPandits[pandit._id]}
              onClick={() => toggleExpand(pandit._id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleExpand(pandit._id)}
              role="button"
              aria-controls={`pandit-details-${pandit._id}`}
              aria-label={`Toggle details for pandit ${pandit.name}`}
            >
              <div
                className="pandit-avatar glass"
                style={{ backgroundImage: `url(${pandit.profile_photo_url || '/images/i1.jpeg'})` }}
                aria-label={`Pandit ${pandit.name}`}
              >
                <span className="pandit-avatar-initial">{pandit.name.charAt(0)}</span>
              </div>
              <div className="pandit-main-info">
                <h4 className="pandit-name hero-text-glow">🧑‍🦳 {pandit.name}</h4>
                <div className="pandit-city">{pandit.city}</div>
              </div>
              {expandedPandits[pandit._id] && (
                <div
                  id={`pandit-details-${pandit._id}`}
                  className="pandit-extra expanded"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <div className="pandit-details">
                    <div className="pandit-badges">
                      <span className="pandit-badge exp">Exp: {pandit.experienceYears} yrs</span>
                      <span className="pandit-badge langs">{pandit.languages?.join(', ')}</span>
                    </div>
                    <div className="pandit-specialties"><b>Specialties:</b> {pandit.specialties?.join(', ')}</div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
        {filteredPandits.length > 3 && (
          <div className="toggle-btn">
            <button
              onClick={() => setVisiblePandits(v => (v === 3 ? filteredPandits.length : 3))}
              className="custom-btn glow-btn"
              aria-expanded={visiblePandits !== 3}
            >
              {visiblePandits === 3 ? 'Show More' : 'Show Less'}
            </button>
          </div>
        )}
      </section>

      {/* BOOKINGS */}
      <section id="booking" className="bookings-section blur-bg" data-aos="fade-up" tabIndex={-1} aria-label="Your bookings">
        <h3 className="section-heading">Your Bookings</h3>
        <input
          type="text"
          className="booking-search"
          aria-label="Search bookings"
          placeholder="Search bookings..."
          value={searchBookings}
          onChange={e => setSearchBookings(e.target.value)}
          autoComplete="off"
        />
        <div className="booking-list" aria-live="polite" aria-relevant="additions removals">
          {filteredBookings.length === 0 ? (
            <p className="empty-msg" aria-live="polite">No bookings found. Book your first puja now!</p>
          ) : (
            filteredBookings.map(b => (
              <motion.div
                key={b._id}
                className="booking-card card-glossy glass neon-card shadow-pop"
                whileHover={{ scale: 1.032, boxShadow: '0 6px 32px #aecaee51' }}
                tabIndex={0}
                role="article"
                aria-label={`Booking for ${b.serviceid?.name ?? 'service'} with ${b.panditid?.name ?? 'pandit'} on ${new Date(b.puja_date).toLocaleDateString()} at ${b.puja_time}`}
              >
                <div className="booking-card-left">
                  <span className="booking-icon" aria-hidden="true">📅</span>
                  <div>
                    <div className="booking-type">{b.serviceid?.name ?? 'Service'}</div>
                    <div className="booking-date">{new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}</div>
                  </div>
                </div>
                <div className="booking-card-right">
                  <div className="booking-pandit">
                    <span className="booking-pandit-label">Pandit:</span> <span>{b.panditid?.name ?? 'N/A'}</span>
                  </div>
                  <div className="booking-location">📍 {b.location}</div>
                  <div className={getStatusClass(b.status)}>{b.status}</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="review" className="review-section glass-review" data-aos="fade-up" tabIndex={-1} aria-label="Submit Review">
        <h3 className="section-heading neon-text" tabIndex={0}>Submit a Review</h3>
        {reviewMessage && (
          <p
            className={reviewMessage.includes('submitted') ? 'success-message' : 'error-message'}
            aria-live="polite"
          >
            {reviewMessage}
          </p>
        )}
        <form
          onSubmit={handleReviewSubmit}
          className="review-form card-glossy glass nice-glass"
          aria-label="Review submission form"
        >
          <div className="review-row">
            <input type="text" value={review.name} disabled className="review-input" aria-label="Your name" />
            <StarRating rating={review.rating} onChange={v => setReview(prev => ({ ...prev, rating: v }))} />
          </div>
          <textarea
            placeholder="Write your feedback..."
            value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
            className="review-input review-textarea"
            required
            aria-required="true"
            aria-label="Feedback text"
          />
          <button type="submit" className="custom-btn glow-btn" disabled={reviewLoading} aria-live="polite">
            {reviewLoading ? 'Submitting...' : 'Submit Review 💬'}
          </button>
        </form>
      </section>

      {/* CHATBOT BUTTON */}
      <button
        aria-label={showChatbot ? "Close Chatbot" : "Open Chatbot"}
        className="chatbot-toggle"
        onClick={() => setShowChatbot(!showChatbot)}
        type="button"
        aria-pressed={showChatbot}
      >
        {showChatbot
          ? '×'
          : <img src="/images/subh.png" alt="Open Chatbot" style={{ borderRadius: '50%', width: 38, height: 38 }} />}
      </button>
      {showChatbot && (
        <div
          className="chatbot-popup"
          role="dialog"
          aria-modal="true"
          aria-label="Chatbot window"
          tabIndex={-1}
        >
          <iframe
            title="Chatbot"
            src="https://www.chatbase.co/chatbot-iframe/usovl2iS71gPfrO5xmRyP"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 15 }}
            allow="clipboard-write"
          />
        </div>
      )}
    </div>
  );
}
