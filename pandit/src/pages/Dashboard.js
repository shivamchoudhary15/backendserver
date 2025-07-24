import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';
import ChatWindow from './ChatWindow';

import {
  Zap,
  Home,
  MessageCircle,
  Users,
  CalendarDays,
  LogOut,
  User,
  CheckCircle,
  MoveRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', icon: <Home size={20} />, goto: '/' },
  { label: 'New Task', icon: <Zap size={20} />, goto: '/booking' },
  { label: 'Feedback', icon: <MessageCircle size={20} />, goto: '#review' },
  { label: 'Experts', icon: <Users size={20} />, goto: '#pandit' },
  { label: 'My Tickets', icon: <CalendarDays size={20} />, goto: '#booking' },
  { label: 'Logout', icon: <LogOut size={20} />, goto: '/login', logout: true },
];

const SLIDER_IMAGES = [
  '/images/i2.jpeg',
  '/images/kalash.jpeg',
  '/images/havan.jpeg',
  '/images/i3.jpeg',
  '/images/i1.jpeg',
];

function StarRating({ rating, onChange }) {
  return (
    <div className="star-rating" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          role="button"
          tabIndex="0"
          className={`star${i <= rating ? ' active' : ''}`}
          aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
          onClick={() => onChange(i)}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onChange(i)}
        >
          <CheckCircle
            color={i <= rating ? '#ffd740' : '#e0e0e0'}
            fill={i <= rating ? '#ffd740' : 'none'}
            size={24}
            style={{ marginRight: 2, verticalAlign: -5 }}
          />
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
  const [chatPanditId, setChatPanditId] = useState(null);
  const [chatPanditName, setChatPanditName] = useState('');

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) return navigate('/login');

    try {
      const parsedUser = JSON.parse(userData);
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
      setCarouselIndex(i => (i + 1) % SLIDER_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!review.name || !review.comment || !review.rating) {
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

  function toggleExpand(id) {
    setExpandedPandits(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const getStatusClass = status =>
    ({
      accepted: 'status accepted',
      rejected: 'status rejected',
      pending: 'status pending',
    }[(status || '').toLowerCase()] || 'status');

  const filteredPandits = pandits.filter(
    p =>
      p.name.toLowerCase().includes(searchPandits.toLowerCase()) ||
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

  return (
    <div className="dashboard-root">
      {/* NAVBAR */}
      <nav
        className={`dashboard-navbar${isNavbarOpen ? ' open' : ''}`}
        aria-label="Main Navigation"
        onMouseEnter={() => setIsNavbarOpen(true)}
        onMouseLeave={() => setIsNavbarOpen(false)}>
        <div className="navbar-brand" tabIndex={0}>
          <img src="/images/subh.png" alt="Logo" className="navbar-logo" />
          <span className="brand-accent neon-text">Shubhkarya</span>
          <span className="navbar-expand-icon" aria-hidden="true">
            {isNavbarOpen ? '▲' : '▼'}
          </span>
        </div>
        <AnimatePresence>
          {isNavbarOpen && (
            <motion.ul
              className="navbar-menu"
              role="menu"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}>
              {NAV_ITEMS.map(item => (
                <motion.li
                  key={item.label}
                  role="menuitem"
                  tabIndex={0}
                  className={`navbar-menu-item${item.logout ? ' logout' : ''}`}
                  onClick={() => handleNavClick(item)}
                  onKeyDown={e => ['Enter', ' '].includes(e.key) && handleNavClick(item)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label={item.label}>
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>

      {/* WELCOME BANNER */}
      {user && (
        <section className="welcome-banner nice-glass" data-aos="fade">
          <h2>
            Welcome, <span>{user.name}</span>!
          </h2>
          <p>May your every puja bring joy and prosperity.</p>
        </section>
      )}

      {/* HERO + SLIDER */}
      <section className="dashboard-hero gradient-hero" id="dashboard" data-aos="fade-down">
        <div className="hero-main-row">
          <div>
            <h1 className="hero-title hero-text-glow">
              Book Trusted Pandits with <span>Shubhkarya</span>
            </h1>
            <p className="hero-desc">
              Your dedicated portal for <b>pujas, havans, and ceremonies</b> with experienced and verified experts.
              <br />
              Browse, book, and experience auspicious bliss from anywhere.
            </p>
            <button
              className="hero-book-btn glow-btn"
              onClick={() => navigate('/booking')}
              aria-label="Book New Puja">
              <Zap size={18} style={{ marginBottom: '-4px', marginRight: 6 }} /> Book New Puja
            </button>
          </div>
          <div className="hero-slider slider-glow" data-aos="zoom-in">
            <div className="slider-frame shadow-pop">
              <img src={SLIDER_IMAGES[carouselIndex]} alt="Spiritual slider" />
              <div className="slider-dots">
                {SLIDER_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`slider-dot${i === carouselIndex ? ' active' : ''}`}
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setCarouselIndex(i)}
                  />
                ))}
              </div>
            </div>
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
        />
        <div className="pandit-list">
          {filteredPandits.slice(0, visiblePandits).map(pandit => (
            <motion.div
              key={pandit._id}
              className="improved-pandit-card neon-card glass-highlight glossy shadow-pop"
              whileHover={{ y: -4, scale: 1.04 }}
              tabIndex={0}
              aria-expanded={expandedPandits[pandit._id]}
              onClick={() => toggleExpand(pandit._id)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && toggleExpand(pandit._id)}>
              <div
                className="pandit-avatar glass"
                style={{ backgroundImage: `url(${pandit.profile_photo_url || '/images/i1.jpeg'})` }}
                aria-label={`Pandit ${pandit.name}`}>
                <User color="#156fee" size={27} style={{ background: 'rgba(255,255,255,0.8)', borderRadius: '50%' }} />
              </div>
              <div className="pandit-main-info">
                <h4 className="pandit-name hero-text-glow">
                  <Users size={16} style={{ marginBottom: '-4px', marginRight: 6 }} /> {pandit.name}
                </h4>
                <div className="pandit-city">{pandit.city}</div>
              </div>
              {expandedPandits[pandit._id] && (
                <div className="pandit-extra expanded">
                  <div className="pandit-details">
                    <div className="pandit-badges">
                      <span className="pandit-badge exp">Exp: {pandit.experienceYears} yrs</span>
                      <span className="pandit-badge langs">{pandit.languages?.join(', ')}</span>
                    </div>
                    <div className="pandit-specialties">
                      <b>Specialties:</b> {pandit.specialties?.join(', ')}
                    </div>
                  </div>
                </div>
              )}
              {/* Chat button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  setChatPanditId(pandit._id);
                  setChatPanditName(pandit.name);
                }}
                style={{ marginTop: 8 }}
                className="custom-btn">
                <MessageCircle size={16} style={{ marginBottom: '-4px', marginRight: 5 }} /> Chat with Pandit
              </button>
            </motion.div>
          ))}
        </div>
        {filteredPandits.length > 3 && (
          <div className="toggle-btn">
            <button
              onClick={() => setVisiblePandits(v => (v === 3 ? filteredPandits.length : 3))}
              className="custom-btn glow-btn"
              aria-expanded={visiblePandits !== 3}>
              {visiblePandits === 3 ? (
                <>
                  Show More <MoveRight size={16} style={{ marginLeft: 4, marginBottom: -3 }} />
                </>
              ) : (
                'Show Less'
              )}
            </button>
          </div>
        )}
      </section>

      {/* Chat Window */}
      {chatPanditId && (
        <ChatWindow userId={user?._id} panditId={chatPanditId} chatName={chatPanditName} onClose={() => setChatPanditId(null)} />
      )}

      {/* BOOKINGS */}
      <section id="booking" className="bookings-section blur-bg" data-aos="fade-up" tabIndex={-1} aria-label="Booking History">
        <h3 className="section-heading">Your Bookings</h3>
        <input
          type="text"
          className="booking-search"
          aria-label="Search bookings"
          placeholder="Search bookings..."
          value={searchBookings}
          onChange={e => setSearchBookings(e.target.value)}
        />
        <div className="booking-list">
          {filteredBookings.length === 0 ? (
            <p className="empty-msg">No bookings found. Book your first puja now!</p>
          ) : (
            filteredBookings.map(b => (
              <motion.div
                key={b._id}
                className="booking-card card-glossy glass neon-card shadow-pop"
                whileHover={{ scale: 1.032, boxShadow: '0 6px 32px #aecaee51' }}
                tabIndex={0}
                role="article"
                aria-label={`Booking for ${b.serviceid?.name} with ${b.panditid?.name} on ${new Date(b.puja_date).toLocaleDateString()} at ${b.puja_time}`}>
                <div className="booking-card-left">
                  <span className="booking-icon" aria-hidden="true">
                    <CalendarDays size={22} color="#ffaa00" />
                  </span>
                  <div>
                    <div className="booking-type">{b.serviceid?.name}</div>
                    <div className="booking-date">
                      {new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}
                    </div>
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

      {/* REVIEW */}
      <section id="review" className="review-section glass-review" data-aos="fade-up" tabIndex={-1} aria-label="Submit Review">
        <h3 className="section-heading neon-text">Submit a Review</h3>
        {reviewMessage && (
          <p className={reviewMessage.includes('thank') ? 'success-message' : 'error-message'}>{reviewMessage}</p>
        )}
        <form onSubmit={handleReviewSubmit} className="review-form card-glossy glass nice-glass" aria-label="Review submission form">
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
          />
          <button type="submit" className="custom-btn glow-btn" disabled={reviewLoading}>
            {reviewLoading ? 'Submitting...' : 'Submit Review 💬'}
          </button>
        </form>
      </section>

      {/* CHATBOT BUTTON */}
      <button aria-label="Toggle Chatbot" className="chatbot-toggle" onClick={() => setShowChatbot(!showChatbot)}>
        {showChatbot ? (
          '×'
        ) : (
          <img src="/images/subh.png" alt="Open Chatbot" style={{ borderRadius: '50%', width: 38, height: 38 }} />
        )}
      </button>
      {showChatbot && (
        <div className="chatbot-popup" role="dialog" aria-modal="true" aria-label="Chatbot window">
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
