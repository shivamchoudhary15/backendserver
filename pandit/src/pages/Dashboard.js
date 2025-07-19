import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';
import { MdLogout, MdHome, MdReviews, MdSearch, MdCalendarToday, MdExpandMore, MdExpandLess, MdVerifiedUser, MdPublic, MdAttachMoney, MdLanguage, MdPerson } from "react-icons/md";
import { GiTempleHindu } from 'react-icons/gi';
import { FaGift, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';

const navbarButtons = [
  { label: 'Home', icon: <MdHome />, goto: '/' },
  { label: 'Book New Puja', icon: <GiTempleHindu />, goto: '/booking' },
  { label: 'Submit Review', icon: <MdReviews />, goto: '#review' },
  { label: 'View Our Pandit', icon: <MdVerifiedUser />, goto: '#pandit' },
  { label: 'Search for Puja', icon: <MdSearch />, goto: '#highlight' },
  { label: 'Booking History', icon: <MdCalendarToday />, goto: '#booking' },
  { label: 'Logout', icon: <MdLogout />, goto: '/home', logout: true },
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
      {[1,2,3,4,5].map(i => (
        <FaStar
          key={i}
          tabIndex={0}
          onClick={() => onChange(i)}
          onKeyPress={e => (e.key === "Enter" || e.key === " ") && onChange(i)}
          className={i <= rating ? 'active' : ''}
          aria-label={`Rate ${i} star${i>1?'s':''}`}
        />
      ))}
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const bookingsRef = useRef(null);
  const reviewsRef = useRef(null);

  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Reviews
  const [review, setReview] = useState({ name: '', rating: 0, comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  
  // Bookings & Pandits
  const [bookings, setBookings] = useState([]);
  const [searchPandits, setSearchPandits] = useState('');
  const [searchBookings, setSearchBookings] = useState('');
  const [pandits, setPandits] = useState([]);
  const [visiblePandits, setVisiblePandits] = useState(3);
  const [expandedPandits, setExpandedPandits] = useState({});
  const [carouselIndex, setCarouselIndex] = useState(0);

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
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(idx => (idx + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavMouseEnter = () => setNavbarOpen(true);
  const handleNavMouseLeave = () => setNavbarOpen(false);

  const handleNavClick = (item) => {
    if (item.logout) {
      localStorage.clear();
      navigate(item.goto);
    } else if ((item.goto+"").startsWith('#')) {
      const section = document.querySelector(item.goto);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      setNavbarOpen(false);
    } else {
      navigate(item.goto);
    }
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
      setTimeout(() => setReviewMessage(''), 2500);
    }
  };

  const getStatusClass = (status) => ({
    accepted: 'status accepted',
    rejected: 'status rejected',
    pending: 'status pending'
  }[(status||'').toLowerCase()] || 'status');

  const filteredPandits = pandits.filter(p =>
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

  const toggleExpand = (id) => setExpandedPandits(p => ({
    ...p, [id]: !p[id]
  }));

  // --- UI RENDER ---
  return (
    <div className="dashboard-root">
      {/* NAVBAR */}
      <nav
        className={`dashboard-navbar${isNavbarOpen ? ' open' : ''}`}
        aria-label="Main navigation"
        onMouseEnter={handleNavMouseEnter}
        onMouseLeave={handleNavMouseLeave}
      >
        <div className="navbar-brand" tabIndex={0}>
          <img src="/images/subh.png" alt="Logo" className="navbar-logo" />
          <span className="brand-accent neon-text">Shubhkarya</span>
          <span className="navbar-expand-icon" aria-hidden>
            {isNavbarOpen ? <MdExpandLess /> : <MdExpandMore />}
          </span>
        </div>
        <AnimatePresence>
        {isNavbarOpen &&
          <motion.ul
            className="navbar-menu"
            role="menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {navbarButtons.map((item, i) => (
              <motion.li
                key={item.label}
                role="menuitem"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                tabIndex={0}
                className={`navbar-menu-item${item.logout ? ' logout' : ''}`}
                onClick={() => handleNavClick(item)}
                onKeyDown={e => (e.key === "Enter" || e.key===" ") && handleNavClick(item)}
                aria-label={item.label}
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

      {/* HERO + SLIDER */}
      <section className="dashboard-hero gradient-hero" id="dashboard" data-aos="fade-down">
        <div className="hero-main-row">
          <div>
            <h1 className="hero-title hero-text-glow">
              Book Trusted Pandits with <span>Shubhkarya</span>
            </h1>
            <p className="hero-desc">
              Your dedicated portal for <b>pujas, havans, and ceremonies</b> with experienced and verified experts.<br />
              Browse, book, and experience auspicious bliss from anywhere.
            </p>
            <button className="hero-book-btn glow-btn" onClick={()=>navigate('/booking')}>
              <GiTempleHindu /> Book New Puja
            </button>
          </div>
          <div className="hero-slider slider-glow" data-aos="zoom-in">
            <div className="slider-frame shadow-pop">
              <img src={sliderImages[carouselIndex % sliderImages.length]} alt="Shubhkarya slider" />
              <div className="slider-dots">
                {sliderImages.map((_,i) => (
                  <button
                    key={i}
                    className={`slider-dot${i===carouselIndex % sliderImages.length ? " active" : ""}`}
                    aria-label={`Go to slide ${i+1}`}
                    onClick={() => setCarouselIndex(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section id="highlight" className="highlight-section" data-aos="fade-up">
        <div className="highlight-card glass-highlight theme1" style={{ backgroundImage: "url('/images/india.jpeg')" }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <MdVerifiedUser size={32} aria-label="Verified" style={{ color: '#ffe064' }}/>
            <h4>Spiritual Guides</h4>
            <p>Pandits & Consultants across India</p>
            <p>250+ Experts</p>
          </div>
        </div>
        <div className="highlight-card glass-highlight theme2" style={{ backgroundImage: "url('/images/kalash.jpeg')" }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <GiTempleHindu size={32} aria-label="Temple" style={{ color: '#f66613' }}/>
            <h4>Religious Services</h4>
            <p>Wide variety of pujas</p>
            <p>100+ Pujas</p>
          </div>
        </div>
        <div className="highlight-card glass-highlight theme3" style={{ backgroundImage: "url('/images/havan.jpeg')" }}>
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <MdCalendarToday size={27} aria-label="Calendar" style={{ color: '#7ce85c' }}/>
            <h4>Pujas Done</h4>
            <p>Performed by verified pandits</p>
            <p>1,000+ Completed</p>
          </div>
        </div>
      </section>

      {/* WHY SHUBHKARYA */}
      <section className="why-shubhkarya-section nice-glass" data-aos="fade-up">
        <h3>
          Why Choose <span className="brand-accent">Shubhkarya?</span>
        </h3>
        <div className="why-cards-row">
          <div className="why-card neon-card">
            <div className="why-icon glow-icon"><MdVerifiedUser /></div>
            <div>
              <h5>Verified Pandits</h5>
              <p>Background-checked and reviewed experts at your service.</p>
            </div>
          </div>
          <div className="why-card neon-card">
            <div className="why-icon glow-icon"><MdPublic /></div>
            <div>
              <h5>Pan India Support</h5>
              <p>Metro & local experts available in all states.</p>
            </div>
          </div>
          <div className="why-card neon-card">
            <div className="why-icon glow-icon"><MdAttachMoney /></div>
            <div>
              <h5>Transparent Pricing</h5>
              <p>No hidden charges, clear billing, and fair policies.</p>
            </div>
          </div>
          <div className="why-card neon-card">
            <div className="why-icon glow-icon"><MdLanguage /></div>
            <div>
              <h5>Choose by Tradition</h5>
              <p>Select by tradition, date, or preferred language.</p>
            </div>
          </div>
        </div>
        {/* Festive Offer */}
        <div className="promo-announcement improved-offer animated-pop-offer offer-gradient-glass">
          <FaGift className="promo-gift" />
          <div className="offer-content">
            <b>Festive Offer!</b>
            <span>
              Get <span className="offer-amt">₹50 OFF</span> your first puja <span className="offer-code">(code: <b>SHUBH50</b>)</span>
            </span>
          </div>
        </div>
      </section>

      {/* PANDIT SHOWCASE */}
      <section id="pandit" className="pandit-section" data-aos="fade-up">
        <h3 className="section-heading">Verified Pandits</h3>
        <input
          type="text"
          className="booking-search"
          placeholder="Search by name or city..."
          value={searchPandits}
          onChange={e => setSearchPandits(e.target.value)}
          aria-label="Search pandits"
        />
        <div className="pandit-list">
          {filteredPandits.slice(0, visiblePandits).map(p => (
            <motion.div
              key={p._id}
              className="improved-pandit-card neon-card glass-highlight glossy shadow-pop"
              data-aos="zoom-in"
              whileHover={{ y: -4, scale: 1.04 }}
            >
              <div
                className="pandit-avatar glass"
                style={{
                  backgroundImage: `url(${p.profile_photo_url || '/images/i1.jpeg'})`
                }}
                title={p.name}
                aria-label={`Pandit: ${p.name}`}
                tabIndex={0}
                onClick={() => toggleExpand(p._id)}
              >
                <span className="pandit-avatar-initial">{(p.name || '').slice(0,1)}</span>
              </div>
              <div className="pandit-main-info">
                <h4 className="pandit-name hero-text-glow" tabIndex={0} onClick={() => toggleExpand(p._id)}>
                  <MdPerson className="pandit-emoji" /> {p.name}
                </h4>
                <div className="pandit-city">{p.city}</div>
              </div>
              <motion.div
                className={`pandit-extra${expandedPandits[p._id] ? ' expanded' : ''}`}
                initial={false}
                animate={{ height: expandedPandits[p._id] ? "auto" : 0, opacity: expandedPandits[p._id] ? 1 : 0 }}
                transition={{ duration: 0.35 }}
                aria-expanded={expandedPandits[p._id]}
              >
                {expandedPandits[p._id] && (
                  <div className="pandit-details">
                    <div className="pandit-badges">
                      <span className="pandit-badge exp">Exp: {p.experienceYears} yrs</span>
                      <span className="pandit-badge langs">{p.languages?.join(', ')}</span>
                    </div>
                    <div className="pandit-specialties">
                      <b>Specialties:</b> {p.specialties?.join(', ')}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
        {filteredPandits.length > 3 && (
          <div className="toggle-btn">
            <button onClick={() => setVisiblePandits(v => v === 3 ? filteredPandits.length : 3)} className="custom-btn glow-btn">
              {visiblePandits === 3 ? 'Show More' : 'Show Less'}
            </button>
          </div>
        )}
      </section>

      {/* BOOKINGS HISTORY */}
      <section id="booking" ref={bookingsRef} className="bookings-section blur-bg" data-aos="fade-up">
        <h3 className="section-heading">Your Bookings</h3>
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
              <motion.div
                key={b._id}
                className="booking-card card-glossy glass neon-card shadow-pop"
                whileHover={{ scale: 1.032, boxShadow: '0 6px 32px #aecaee51' }}
              >
                <div className="booking-card-left">
                  <span className="booking-icon"><MdCalendarToday /></span>
                  <div>
                    <div className="booking-type">{b.serviceid?.name || b.serviceid}</div>
                    <div className="booking-date">{new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}</div>
                  </div>
                </div>
                <div className="booking-card-right">
                  <div className="booking-pandit">
                    <span className="booking-pandit-label">Pandit:</span> <span>{b.panditid?.name || 'N/A'}</span>
                  </div>
                  <div className="booking-location">📍 {b.location}</div>
                  <div className={getStatusClass(b.status)}>
                    {b.status}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="review" ref={reviewsRef} className="review-section glass-review" data-aos="fade-up">
        <h3 className="section-heading neon-text">Submit a Review</h3>
        {reviewMessage && (
          <p className={reviewMessage.includes('submitted') ? 'success-message' : 'error-message'}>{reviewMessage}</p>
        )}
        <form onSubmit={handleReviewSubmit} className="review-form card-glossy glass nice-glass">
          <div className="review-row">
            <input type="text" value={review.name} disabled className="review-input" />
            <StarRating
              rating={review.rating}
              onChange={v => setReview(prev => ({ ...prev, rating: v }))}
            />
          </div>
          <textarea
            placeholder="Write your feedback..."
            value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
            className="review-input review-textarea"
            required
          />
          <button type="submit" className="custom-btn glow-btn" disabled={reviewLoading}>
            {reviewLoading ? 'Submitting...' : 'Submit Review'} <MdReviews style={{verticalAlign:'-2px'}}/>
          </button>
        </form>
      </section>
    </div>
  );
}

export default Dashboard;
