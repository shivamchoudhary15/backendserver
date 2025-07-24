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
    <div className="star-rating" aria-label="Rating">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          role="button"
          tabIndex="0"
          className={`star ${i <= rating ? 'active' : ''}`}
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

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [visiblePandits, setVisiblePandits] = useState(3);
  const [expandedPandits, setExpandedPandits] = useState({});
  const [searchPandits, setSearchPandits] = useState('');
  const [searchBookings, setSearchBookings] = useState('');

  const [review, setReview] = useState({ name: '', rating: 0, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const [showChatbot, setShowChatbot] = useState(false);

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
    } else if (String(item.goto).startsWith('#')) {
      const section = document.querySelector(item.goto);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
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

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard-root">
      {/* LEFT SIDEBAR */}
      <aside className={`dashboard-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <img src="/images/subh.png" alt="Logo" className="sidebar-logo" />
            {!isSidebarCollapsed && (
              <div className="brand-text">
                <span className="brand-name">Shubhkarya</span>
                <span className="brand-tagline">Spiritual Portal</span>
              </div>
            )}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            {isSidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">
              {!isSidebarCollapsed && 'Navigation'}
            </div>
            {navbarItems.map(item => (
              <motion.button
                key={item.label}
                className={`nav-item ${item.logout ? 'logout' : ''}`}
                onClick={() => handleNavClick(item)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.95 }}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <span className="nav-icon">{item.icon}</span>
                {!isSidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </motion.button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          {!isSidebarCollapsed && (
            <div className="sidebar-stats">
              <div className="stat-item">
                <span className="stat-icon">📊</span>
                <div className="stat-info">
                  <span className="stat-value">{bookings.length}</span>
                  <span className="stat-label">Total Bookings</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🕉️</span>
                <div className="stat-info">
                  <span className="stat-value">{pandits.length}</span>
                  <span className="stat-label">Available Pandits</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`dashboard-main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* TOP HEADER */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="header-greeting">
              <h1>Welcome back, <span className="user-name">{user?.name}</span>!</h1>
              <p className="header-subtitle">Here's what's happening with your spiritual journey today</p>
            </div>
          </div>
          
          <div className="header-right">
            <div className="header-time">
              <div className="time-display">{currentTime}</div>
              <div className="date-display">{currentDate}</div>
            </div>
            
            <div className="user-profile">
              <div className="user-avatar">
                <img 
                  src={user?.profile_photo || '/images/i1.jpeg'} 
                  alt={user?.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="user-initial" style={{display: 'none'}}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <div className="user-info">
                <div className="user-name-header">{user?.name}</div>
                <div className="user-role">Devotee</div>
              </div>
              <div className="user-status">
                <div className="status-indicator active"></div>
              </div>
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <div className="dashboard-content">
          {/* STATS CARDS */}
          <div className="stats-grid" data-aos="fade-up">
            <div className="stat-card booking-stats">
              <div className="stat-icon-large">📅</div>
              <div className="stat-content">
                <h3>{bookings.length}</h3>
                <p>Total Bookings</p>
                <span className="stat-trend">
                  {bookings.filter(b => b.status === 'accepted').length} Completed
                </span>
              </div>
            </div>
            
            <div className="stat-card pandit-stats">
              <div className="stat-icon-large">👨‍🦳</div>
              <div className="stat-content">
                <h3>{pandits.length}</h3>
                <p>Available Pandits</p>
                <span className="stat-trend">Verified Experts</span>
              </div>
            </div>
            
            <div className="stat-card pending-stats">
              <div className="stat-icon-large">⏳</div>
              <div className="stat-content">
                <h3>{bookings.filter(b => b.status === 'pending').length}</h3>
                <p>Pending Bookings</p>
                <span className="stat-trend">Awaiting Confirmation</span>
              </div>
            </div>
            
            <div className="stat-card quick-action">
              <div className="stat-icon-large">🛕</div>
              <div className="stat-content">
                <h3>Book Now</h3>
                <p>Quick Puja Booking</p>
                <button 
                  className="quick-action-btn"
                  onClick={() => navigate('/booking')}
                >
                  Start Booking
                </button>
              </div>
            </div>
          </div>

          {/* HERO + SLIDER */}
          <section className="dashboard-hero" id="dashboard" data-aos="fade-down">
            <div className="hero-content">
              <div className="hero-text">
                <h2 className="hero-title">
                  Connect with Trusted <span className="gradient-text">Spiritual Guides</span>
                </h2>
                <p className="hero-description">
                  Experience authentic pujas, havans, and sacred ceremonies with verified pandits across India. 
                  Your spiritual journey begins with a single click.
                </p>
                <div className="hero-buttons">
                  <button
                    className="hero-btn primary"
                    onClick={() => navigate('/booking')}
                  >
                    🛕 Book Sacred Puja
                  </button>
                  <button
                    className="hero-btn secondary"
                    onClick={() => document.querySelector('#pandit').scrollIntoView({ behavior: 'smooth' })}
                  >
                    👨‍🦳 Meet Our Pandits
                  </button>
                </div>
              </div>
              
              <div className="hero-slider" data-aos="zoom-in">
                <div className="slider-container">
                  <img src={sliderImages[carouselIndex]} alt="Spiritual ceremony" />
                  <div className="slider-overlay">
                    <div className="slider-info">
                      <span className="slider-title">Sacred Ceremonies</span>
                      <span className="slider-subtitle">Experience Divine Bliss</span>
                    </div>
                  </div>
                  <div className="slider-dots">
                    {sliderImages.map((_, i) => (
                      <button
                        key={i}
                        className={`slider-dot ${i === carouselIndex ? 'active' : ''}`}
                        onClick={() => setCarouselIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* HIGHLIGHTS */}
          <section id="highlight" className="highlights-section" data-aos="fade-up">
            <div className="section-header">
              <h2 className="section-title">Why Choose Shubhkarya</h2>
              <p className="section-subtitle">Trusted by thousands for authentic spiritual experiences</p>
            </div>
            
            <div className="highlights-grid">
              <div className="highlight-card expertise">
                <div className="highlight-icon">✨</div>
                <h3>250+ Spiritual Guides</h3>
                <p>Verified pandits and consultants across India ready to serve</p>
                <div className="highlight-stat">
                  <img src="/images/india.jpeg" alt="India" className="highlight-bg" />
                </div>
              </div>
              
              <div className="highlight-card services">
                <div className="highlight-icon">🛕</div>
                <h3>100+ Sacred Services</h3>
                <p>Wide variety of pujas, havans, and ceremonies for every occasion</p>
                <div className="highlight-stat">
                  <img src="/images/kalash.jpeg" alt="Kalash" className="highlight-bg" />
                </div>
              </div>
              
              <div className="highlight-card completed">
                <div className="highlight-icon">🕉️</div>
                <h3>1,000+ Completed</h3>
                <p>Successfully performed ceremonies bringing joy to families</p>
                <div className="highlight-stat">
                  <img src="/images/havan.jpeg" alt="Havan" className="highlight-bg" />
                </div>
              </div>
            </div>
          </section>

          {/* FEATURES GRID */}
          <section className="features-section" data-aos="fade-up">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">✅</div>
                <h4>Verified Pandits</h4>
                <p>Background-checked and reviewed spiritual experts</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌏</div>
                <h4>Pan India Support</h4>
                <p>Services available across all states and cities</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h4>Transparent Pricing</h4>
                <p>No hidden charges with clear billing policies</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔆</div>
                <h4>Custom Traditions</h4>
                <p>Choose by tradition, language, and preferences</p>
              </div>
            </div>
          </section>

          {/* FESTIVE OFFER */}
          <div className="festive-offer" data-aos="zoom-in">
            <div className="offer-content">
              <div className="offer-icon">🎁</div>
              <div className="offer-text">
                <h3>Festive Special Offer!</h3>
                <p>Get <span className="offer-amount">₹50 OFF</span> on your first puja booking</p>
                <span className="offer-code">Use code: <strong>SHUBH50</strong></span>
              </div>
            </div>
          </div>

          {/* PANDIT SHOWCASE */}
          <section id="pandit" className="pandit-section" data-aos="fade-up">
            <div className="section-header">
              <h2 className="section-title">Our Verified Pandits</h2>
              <div className="section-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by name or city..."
                  value={searchPandits}
                  onChange={e => setSearchPandits(e.target.value)}
                />
              </div>
            </div>
            
            <div className="pandit-grid">
              {filteredPandits.slice(0, visiblePandits).map(pandit => (
                <motion.div
                  key={pandit._id}
                  className="pandit-card"
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={() => toggleExpand(pandit._id)}
                >
                  <div className="pandit-avatar-section">
                    <div 
                      className="pandit-avatar"
                      style={{ backgroundImage: `url(${pandit.profile_photo_url || '/images/i1.jpeg'})` }}
                    >
                      <span className="avatar-initial">{pandit.name.charAt(0)}</span>
                    </div>
                    <div className="verification-badge">✓</div>
                  </div>
                  
                  <div className="pandit-info">
                    <h3 className="pandit-name">{pandit.name}</h3>
                    <p className="pandit-city">📍 {pandit.city}</p>
                    
                    <div className="pandit-badges">
                      <span className="badge experience">{pandit.experienceYears}+ years</span>
                      <span className="badge rating">⭐ 4.8</span>
                    </div>
                    
                    {expandedPandits[pandit._id] && (
                      <motion.div 
                        className="pandit-details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                      >
                        <div className="detail-item">
                          <strong>Languages:</strong> {pandit.languages?.join(', ')}
                        </div>
                        <div className="detail-item">
                          <strong>Specialties:</strong> {pandit.specialties?.join(', ')}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredPandits.length > 3 && (
              <div className="section-actions center">
                <button
                  className="action-btn secondary"
                  onClick={() => setVisiblePandits(v => (v === 3 ? filteredPandits.length : 3))}
                >
                  {visiblePandits === 3 ? 'Show All Pandits' : 'Show Less'}
                </button>
              </div>
            )}
          </section>

          {/* BOOKINGS */}
          <section id="booking" className="bookings-section" data-aos="fade-up">
            <div className="section-header">
              <h2 className="section-title">Your Booking History</h2>
              <div className="section-actions">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search bookings..."
                  value={searchBookings}
                  onChange={e => setSearchBookings(e.target.value)}
                />
              </div>
            </div>
            
            <div className="bookings-grid">
              {filteredBookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📅</div>
                  <h3>No bookings found</h3>
                  <p>Start your spiritual journey by booking your first puja</p>
                  <button 
                    className="action-btn primary"
                    onClick={() => navigate('/booking')}
                  >
                    Book Your First Puja
                  </button>
                </div>
              ) : (
                filteredBookings.map(booking => (
                  <motion.div
                    key={booking._id}
                    className="booking-card"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="booking-header">
                      <div className="booking-icon">🛕</div>
                      <div className="booking-status">
                        <span className={`status-badge ${booking.status}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="booking-info">
                      <h3 className="service-name">{booking.serviceid?.name}</h3>
                      <p className="pandit-name">👨‍🦳 {booking.panditid?.name}</p>
                      <div className="booking-details">
                        <span className="booking-date">
                          📅 {new Date(booking.puja_date).toLocaleDateString()}
                        </span>
                        <span className="booking-time">⏰ {booking.puja_time}</span>
                        <span className="booking-location">📍 {booking.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </section>

          {/* REVIEWS */}
          <section id="review" className="review-section" data-aos="fade-up">
            <div className="section-header">
              <h2 className="section-title">Share Your Experience</h2>
              <p className="section-subtitle">Help others by sharing your spiritual journey experience</p>
            </div>
            
            {reviewMessage && (
              <div className={`message ${reviewMessage.includes('Thank') ? 'success' : 'error'}`}>
                {reviewMessage}
              </div>
            )}
            
            <form onSubmit={handleReviewSubmit} className="review-form">
              <div className="form-row">
                <input 
                  type="text" 
                  value={review.name} 
                  disabled 
                  className="form-input"
                  placeholder="Your name"
                />
                <StarRating 
                  rating={review.rating} 
                  onChange={v => setReview(prev => ({ ...prev, rating: v }))} 
                />
              </div>
              
              <textarea
                placeholder="Share your experience with us..."
                value={review.comment}
                onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
                className="form-textarea"
                required
              />
              
              <button 
                type="submit" 
                className="submit-btn"
                disabled={reviewLoading}
              >
                {reviewLoading ? 'Submitting...' : '💬 Submit Review'}
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* CHATBOT */}
      <button
        className="chatbot-toggle"
        onClick={() => setShowChatbot(!showChatbot)}
        aria-label="Toggle Chatbot"
      >
        {showChatbot ? '×' : <img src="/images/subh.png" alt="Chat" />}
      </button>
      
      {showChatbot && (
        <div className="chatbot-popup">
          <iframe
            title="Chatbot"
            src="https://www.chatbase.co/chatbot-iframe/usovl2iS71gPfrO5xmRyP"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="clipboard-write"
          />
        </div>
      )}
    </div>
  );
}
