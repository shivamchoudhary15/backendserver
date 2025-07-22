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

function StarRating({ rating, onChange }) {
  return (
    <div className="bolt-star-rating" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          role="button"
          tabIndex="0"
          className={`bolt-star ${i <= rating ? 'active' : ''}`}
          aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
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
  const [expandedPandits, setExpandedPandits] = useState({});
  const [visiblePandits, setVisiblePandits] = useState(4);
  const [searchPandits, setSearchPandits] = useState('');
  const [searchBookings, setSearchBookings] = useState('');
  const [review, setReview] = useState({ name: '', rating: 0, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });

    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'admin') {
        navigate('/admin');
        return;
      }
      if (parsedUser.role === 'pandit') {
        navigate('/pandit/dashboard');
        return;
      }
      setUser(parsedUser);
      setReview(r => ({ ...r, name: parsedUser.name }));

      getBookings({ userid: parsedUser._id }).then(res => setBookings(res.data || []));
      getVerifiedPandits().then(res => setPandits(res.data || []));
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(i => (i + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  function handleNavClick(item) {
    if (item.logout) {
      localStorage.clear();
      navigate(item.goto);
      return;
    }
    if (String(item.goto).startsWith('#')) {
      const el = document.querySelector(item.goto);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setIsNavbarOpen(false);
      return;
    }
    navigate(item.goto);
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!review.rating || !review.comment) {
      setReviewMessage('Please rate and write your feedback.');
      return;
    }
    setReviewLoading(true);
    try {
      await createReview(review);
      setReviewMessage('Thank you for your review!');
      setReview(r => ({ ...r, rating: 0, comment: '' }));
    } catch {
      setReviewMessage('Failed to submit review.');
    } finally {
      setReviewLoading(false);
      setTimeout(() => setReviewMessage(''), 2500);
    }
  }

  function toggleExpand(id) {
    setExpandedPandits(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const getStatusClass = status =>
    ({
      accepted: 'status accepted',
      rejected: 'status rejected',
      pending: 'status pending',
    }[(status || '').toLowerCase()] || 'status');

  // Filters
  const filteredPandits = pandits.filter(
    p =>
      p.name.toLowerCase().includes(searchPandits.toLowerCase()) ||
      (p.city || '').toLowerCase().includes(searchPandits.toLowerCase())
  );

  const filteredBookings = bookings.filter(b => {
    const query = searchBookings.toLowerCase();
    return (
      (b.panditid?.name || '').toLowerCase().includes(query) ||
      (b.serviceid?.name || '').toLowerCase().includes(query) ||
      new Date(b.puja_date).toLocaleDateString().includes(query)
    );
  });

  return (
    <div className="bolt-root">
      {/* Navbar */}
      <nav
        className={`bolt-navbar${isNavbarOpen ? ' open' : ''}`}
        onMouseEnter={() => setIsNavbarOpen(true)}
        onMouseLeave={() => setIsNavbarOpen(false)}
      >
        <div className="bolt-navbar-brand" tabIndex={0}>
          <img src="/images/subh.png" alt="Logo" className="bolt-navbar-logo" />
          <span className="bolt-navbar-brand-name">Shubhkarya</span>
          <span className="bolt-navbar-expand">{isNavbarOpen ? '▲' : '▼'}</span>
        </div>
        <AnimatePresence>
          {isNavbarOpen && (
            <motion.ul
              className="bolt-navbar-menu"
              role="menu"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.22 }}
            >
              {navbarItems.map(item => (
                <motion.li
                  key={item.label}
                  tabIndex={0}
                  className={`bolt-navbar-menu-item${item.logout ? ' logout' : ''}`}
                  onClick={() => handleNavClick(item)}
                  onKeyDown={e => ['Enter', ' '].includes(e.key) && handleNavClick(item)}
                  whileHover={{ scale: 1.055 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="bolt-nav-icon">{item.icon}</span>
                  {item.label}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>

      {/* Welcome Banner */}
      {user && (
        <section className="welcome-banner nice-glass" data-aos="fade">
          <h2>Welcome, <span>{user.name}</span>!</h2>
          <p>May your every puja bring joy and prosperity.</p>
        </section>
      )}

      {/* Hero */}
      <section className="bolt-hero-section" data-aos="fade-down" id="dashboard">
        <div className="bolt-hero-content">
          <div>
            <h1>
              <span className="bolt-hero-title-glow">Book Verified Pandits</span><br />
              with <span className="bolt-hero-brand-gradient">Shubhkarya</span>
            </h1>
            <p className="bolt-hero-desc">Auspicious Pujas. Trusted Experts. Nationwide. <span className="bolt-highlight-strong">Feel divine from home!</span></p>
            <button onClick={() => navigate('/booking')} className="bolt-hero-button" aria-label="Book New Puja">🛕 Book Now</button>
          </div>
          <div className="bolt-slider-frame">
            <img src={sliderImages[carouselIndex]} alt="Puja slider" />
            <div className="bolt-slider-dots">
              {sliderImages.map((_, i) => (
                <button key={i} className={`bolt-slider-dot${i === carouselIndex ? ' active' : ''}`} onClick={() => setCarouselIndex(i)} aria-label={`Go to slide ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section id="highlight" className="highlight-section" data-aos="fade-up" aria-label="Platform highlights">
        <div className="highlight-card glass-highlight theme1" style={{ backgroundImage: 'url(/images/india.jpeg)' }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <span role="img" aria-label="Verified" style={{ fontSize: '2em' }}>✔️</span>
            <h4>Spiritual Guides</h4>
            <p>Pandits & Consultants across India</p>
            <p>250+ Experts</p>
          </div>
        </div>
        <div className="highlight-card glass-highlight theme2" style={{ backgroundImage: 'url(/images/kalash.jpeg)' }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <span role="img" aria-label="Temple" style={{ fontSize: '2em' }}>🛕</span>
            <h4>Religious Services</h4>
            <p>Wide variety of pujas</p>
            <p>100+ Pujas</p>
          </div>
        </div>
        <div className="highlight-card glass-highlight theme3" style={{ backgroundImage: 'url(/images/havan.jpeg)' }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <span role="img" aria-label="Calendar" style={{ fontSize: '1.7em' }}>📆</span>
            <h4>Pujas Done</h4>
            <p>Performed by verified pandits</p>
            <p>1,000+ Completed</p>
          </div>
        </div>
      </section>

      {/* Why Shubhkarya */}
      <section className="why-shubhkarya-section nice-glass" data-aos="fade-up" aria-label="Why choose Shubhkarya">
        <h3>Why Choose <span className="brand-accent">Shubhkarya?</span></h3>
        <div className="why-cards-row">
          <div className="why-card neon-card">
            <div className="why-icon glow-icon">✅</div>
            <div>
              <h5>Verified Pandits</h5>
              <p>Background-checked and reviewed experts at your service.</p>
            </div>
          </div>
          <div className="why-card neon-card">
            <div className="why-icon glow-icon">🌏</div>
            <div>
              <h5>Pan India Support</h5>
              <p>Metro & local experts available in all states.</p>
            </div>
          </div>
          <div className="why-card neon-card">
            <div className="why-icon glow-icon">💰</div>
            <div>
              <h5>Transparent Pricing</h5>
              <p>No hidden charges, clear billing, and fair policies.</p>
            </div>
          </div>
          <div className="why-card neon-card">
            <div className="why-icon glow-icon">🔆</div>
            <div>
              <h5>Choose by Tradition</h5>
              <p>Select by tradition, date, or preferred language.</p>
            </div>
          </div>
        </div>
        <div className="promo-announcement improved-offer animated-pop-offer offer-gradient-glass" aria-label="Festive offer">
          <span className="promo-gift" role="img" style={{ fontSize: '2.1em' }}>🎁</span>
          <div className="offer-content">
            <b>Festive Offer!</b> Get <span className="offer-amt">₹50 OFF</span> your first puja <span className="offer-code">(code: <b>SHUBH50</b>)</span>
          </div>
        </div>
      </section>

      {/* Verified Pandits Section */}
      <section id="pandit" className="bolt-verified-pandit-section" data-aos="fade-up" tabIndex={-1} aria-label="Verified Pandits">
        <div className="bolt-section-title-row">
          <h2>Verified Pandits</h2>
          <input
            type="text"
            className="bolt-pandit-search"
            placeholder="Search by name or city…"
            value={searchPandits}
            onChange={e => setSearchPandits(e.target.value)}
            aria-label="Search Pandits"
          />
        </div>
        <div className="bolt-pandit-list">
          {filteredPandits.slice(0, visiblePandits).map(p => (
            <motion.div
              key={p._id}
              className="bolt-pandit-card"
              whileHover={{ scale: 1.045, y: -6 }}
              onClick={() => toggleExpand(p._id)}
              tabIndex={0}
              aria-expanded={!!expandedPandits[p._id]}
            >
              <div className="bolt-pandit-avatar" style={{ backgroundImage: `url(${p.profile_photo_url || '/images/i1.jpeg'})` }} aria-label={`Pandit ${p.name}`}>
                <span className="bolt-pandit-initial">{p.name?.[0]}</span>
              </div>
              <div className="bolt-pandit-main">
                <div>
                  <span className="bolt-pandit-name">🧑‍🦳 {p.name}</span>
                  <span className="bolt-pandit-city">📍 {p.city}</span>
                </div>
                {expandedPandits[p._id] && (
                  <div className="bolt-pandit-expanded">
                    <div className="bolt-pandit-badges">
                      <span className="bolt-pandit-badge bolt-exp">Exp: {p.experienceYears} yrs</span>
                      <span className="bolt-pandit-badge bolt-langs">{(p.languages || []).join(', ')}</span>
                    </div>
                    <div className="bolt-pandit-specials">👉 <b>Specialties:</b> {p.specialties?.join(', ')}</div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{textAlign:'center', margin:'18px 0'}}>
          {filteredPandits.length > visiblePandits && (
            <button className="bolt-see-more" onClick={() => setVisiblePandits(v => v + 4)}>Show More</button>
          )}
          {visiblePandits > 4 && (
            <button className="bolt-see-more" style={{marginLeft: 8}} onClick={() => setVisiblePandits(4)}>Show Less</button>
          )}
        </div>
      </section>

      {/* Booking History Section */}
      <section id="booking" className="bookings-section blur-bg" data-aos="fade-up" tabIndex={-1} aria-label="Booking History">
        <h2>Your Bookings</h2>
        <input
          type="text"
          className="booking-search"
          placeholder="Search bookings..."
          value={searchBookings}
          onChange={e => setSearchBookings(e.target.value)}
          aria-label="Search bookings"
        />
        <div className="booking-list">
          {filteredBookings.length === 0 ? (
            <p className="empty-msg">No bookings found. Book your first puja now!</p>
          ) : (
            filteredBookings.map(b => (
              <motion.div key={b._id} className="booking-card card-glossy glass neon-card shadow-pop" whileHover={{ scale: 1.032, boxShadow: '0 6px 32px #aecaee51' }} tabIndex={0}>
                <div className="booking-card-left">
                  <span className="booking-icon" aria-hidden="true">📅</span>
                  <div>
                    <div className="booking-type">{b.serviceid?.name}</div>
                    <div className="booking-date">{new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}</div>
                  </div>
                </div>
                <div className="booking-card-right">
                  <div className="booking-pandit"><span className="booking-pandit-label">Pandit:</span> {b.panditid?.name || 'N/A'}</div>
                  <div className="booking-location">📍 {b.location}</div>
                  <div className={getStatusClass(b.status)}>{b.status}</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Review Section */}
      <section id="review" className="bolt-review-section" data-aos="fade-up" tabIndex={-1}>
        <h2>Submit Your Review</h2>
        <form className="bolt-review-form" onSubmit={handleReviewSubmit}>
          <div className="bolt-review-row">
            <input type="text" className="bolt-review-input" value={review.name} disabled aria-label="Your name" />
            <StarRating rating={review.rating} onChange={v => setReview(prev => ({ ...prev, rating: v }))} />
          </div>
          <textarea className="bolt-review-textarea" placeholder="Share your experience..." required value={review.comment} onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))} />
          <button className="bolt-review-button" disabled={reviewLoading} type="submit">
            {reviewLoading ? 'Submitting...' : 'Submit Review 💬'}
          </button>
          {reviewMessage && <div className="bolt-review-msg">{reviewMessage}</div>}
        </form>
      </section>

      {/* Chatbot Toggle */}
      <button aria-label="Toggle Chatbot" className="chatbot-toggle" onClick={() => setShowChatbot(!showChatbot)}>
        {showChatbot ? '×' : <img src="/images/subh.png" alt="Chatbot" style={{ borderRadius: '50%', width: 38, height: 38 }} />}
      </button>

      {/* Chatbot Frame */}
      {showChatbot && (
        <div className="chatbot-popup" role="dialog" aria-modal="true" aria-label="Chatbot window">
          <iframe title="Chatbot" src="https://www.chatbase.co/chatbot-iframe/usovl2iS71gPfrO5xmRyP" style={{ width: '100%', height: '100%', border: 'none', borderRadius: 15 }} allow="clipboard-write" />
        </div>
      )}
    </div>
  );
}

function getStatusClass(status) {
  if (!status) return 'status';
  switch (status.toLowerCase()) {
    case 'accepted': return 'status accepted';
    case 'pending': return 'status pending';
    case 'rejected': return 'status rejected';
    default: return 'status';
  }
}
