import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';

const navbarButtons = [
  { label: 'Home', icon: '🏠', goto: '/' },
  { label: 'Book New Puja', icon: '🛕', goto: '/booking' },
  { label: 'Submit Review', icon: '💬', goto: '#review' },
  { label: 'View Our Pandit', icon: '📿', goto: '#pandit' },
  { label: 'Search for Puja', icon: '🔍', goto: '#highlight' },
  { label: 'Booking History', icon: '📅', goto: '#booking' },
  { label: 'Logout', icon: '🚪', goto: '/home', logout: true },
];

function Dashboard() {
  const navigate = useNavigate();
  const bookingsRef = useRef(null);
  const reviewsRef = useRef(null);
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [review, setReview] = useState({ name: '', rating: '', comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [pandits, setPandits] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const sliderImages = [
    '/images/i2.jpeg',
    '/images/kalash.jpeg',
    '/images/havan.jpeg',
    '/images/i3.jpeg',
    '/images/i1.jpeg',
  ];

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
    const interval = setInterval(() => {
      setCarouselIndex(idx => (idx + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const handleNavMouseEnter = () => setNavbarOpen(true);
  const handleNavMouseLeave = () => setNavbarOpen(false);

  const handleNavClick = (item) => {
    if (item.logout) {
      localStorage.clear();
      navigate(item.goto);
    } else if (item.goto.startsWith('#')) {
      const section = document.querySelector(item.goto);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
      setNavbarOpen(false);
    } else {
      navigate(item.goto);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const ratingValue = Number(review.rating);
    if (!review.name || !review.comment || isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setReviewMessage('Please fill all fields with a rating between 1 and 5.');
      return;
    }
    try {
      await createReview(review);
      setReviewMessage('Review submitted!');
      setReview({ name: review.name, rating: '', comment: '' });
    } catch {
      setReviewMessage('Failed to submit review.');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Accepted') return 'status accepted';
    if (status === 'Rejected') return 'status rejected';
    return 'status pending';
  };

  const filteredBookings = bookings.filter(b => {
    const query = search.toLowerCase();
    return (
      b.panditid?.name?.toLowerCase().includes(query) ||
      b.serviceid?.name?.toLowerCase().includes(query) ||
      new Date(b.puja_date).toLocaleDateString().includes(query)
    );
  });

  const filteredPandits = pandits.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-root">
      {/* NAVBAR */}
      <nav
        className={`navbar-main${isNavbarOpen ? ' open' : ''}`}
        onMouseEnter={handleNavMouseEnter}
        onMouseLeave={handleNavMouseLeave}
      >
        <div className="navbar-brand">
          <img src="/images/subh.png" alt="Logo" className="navbar-logo" />
          <span>Shubhkarya</span>
          <span className="navbar-expand-icon">{isNavbarOpen ? '▲' : '▼'}</span>
        </div>
        <AnimatePresence>
        {isNavbarOpen &&
          <motion.ul
            className="navbar-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
          >
            {navbarButtons.map((item,i) => (
              <motion.li
                whileHover={{ scale: 1.06, backgroundColor: "#e0f7fa88" }}
                whileTap={{ scale: 0.97 }}
                tabIndex={0}
                key={item.label}
                className={`navbar-menu-item${item.logout ? ' logout' : ''}`}
                onClick={() => handleNavClick(item)}
              >
                <span className="nav-icon">{item.icon}</span>{item.label}
              </motion.li>
            ))}
          </motion.ul>
        }
        </AnimatePresence>
      </nav>

      {/* WELCOME BANNER */}
      {user && (
        <div className="welcome-banner" data-aos="fade">
          <h2>
            Welcome, <span>{user.name}</span>!
          </h2>
          <p>May your every puja bring joy and prosperity.</p>
        </div>
      )}

      {/* HERO + SLIDER */}
      <section className="dashboard-hero" id="dashboard" data-aos="fade-down">
        <div className="hero-main-row">
          <div>
            <h1 className="hero-title">
              Book Trusted Pandits with <span>Shubhkarya</span>
            </h1>
            <p className="hero-desc">
              Your dedicated portal for <b>pujas, havans, and ceremonies</b> with experienced and verified experts.<br />
              Browse, book, and experience auspicious bliss from anywhere.
            </p>
            <button className="hero-book-btn" onClick={()=>navigate('/booking')}>
              <span role="img" aria-label="puja">🛕</span> Book New Puja
            </button>
          </div>
          <div className="hero-slider slider-glow" data-aos="zoom-in">
            <div className="slider-frame">
              <img src={sliderImages[carouselIndex % sliderImages.length]} alt="Shubhkarya slider" />
              <div className="slider-dots">
                {sliderImages.map((_,i) => (
                  <span key={i} className={i===carouselIndex % sliderImages.length ? "slider-dot active" : "slider-dot"} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section id="highlight" className="highlight-section" data-aos="fade-up">
        <div
          className="highlight-card improved-card theme1"
          style={{ backgroundImage: "url('/images/india.jpeg')" }}
        >
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <h4>Spiritual Guides</h4>
            <p>Pandits & Consultants across India</p>
            <p>250+ Experts</p>
          </div>
        </div>
        <div
          className="highlight-card improved-card theme2"
          style={{ backgroundImage: "url('/images/kalash.jpeg')" }}
        >
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <h4>Religious Services</h4>
            <p>Wide variety of pujas</p>
            <p>100+ Pujas</p>
          </div>
        </div>
        <div
          className="highlight-card improved-card theme3"
          style={{ backgroundImage: "url('/images/havan.jpeg')" }}
        >
          <div className="highlight-overlay" />
          <div className="highlight-content">
            <h4>Pujas Done</h4>
            <p>Performed by verified pandits</p>
            <p>1,000+ Completed</p>
          </div>
        </div>
      </section>

      {/* FESTIVE OFFER BEAUTIFUL CARD */}
      <div className="promo-offer-card">
        <div className="offer-ribbon">Festival Special</div>
        <div className="offer-icon">
          <img src="/images/gift.png" alt="Festive Offer" />
        </div>
        <div className="offer-details">
          <h4>Festive Offer!</h4>
          <p>
            <span className="offer-big">₹50 OFF</span> your first puja
          </p>
          <div className="offer-code-box">
            Use code: <span>SHUBH50</span>
          </div>
        </div>
      </div>

      {/* Why Choose Shubhkarya */}
      <section className="why-shubhkarya-section" data-aos="fade-up">
        <h3>
          Why Choose <span className="brand-accent">Shubhkarya?</span>
        </h3>
        <div className="why-cards-row">
          <div className="why-card">
            <div className="why-icon">✅</div>
            <div>
              <h5>Verified Pandits</h5>
              <p>Background-checked and reviewed experts at your service.</p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon">🌏</div>
            <div>
              <h5>Pan India Support</h5>
              <p>Metro & local experts available in all states.</p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon">💰</div>
            <div>
              <h5>Transparent Pricing</h5>
              <p>No hidden charges, clear billing, and fair policies.</p>
            </div>
          </div>
          <div className="why-card">
            <div className="why-icon">🔆</div>
            <div>
              <h5>Choose by Tradition</h5>
              <p>Select by tradition, date, or preferred language.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pandit Showcase */}
      <section id="pandit" className="pandit-section" data-aos="fade-up">
        <h3>Verified Pandits</h3>
        <input
          type="text"
          className="booking-search"
          placeholder="Search by name or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="pandit-grid">
          {filteredPandits.slice(0, visibleCount).map(p => (
            <motion.div
              key={p._id}
              className="pandit-card fancy-pandit-card"
              data-aos="zoom-in"
              whileHover={{ y: -4, scale: 1.05 }}
            >
              <img className="pandit-avatar" src={p.profile_photo_url || '/images/i1.jpeg'} alt={p.name} />
              <div className="pandit-main">
                <h4>{p.name}</h4>
                <div className="pandit-tags">
                  <span className="pandit-tag location">{p.city}</span>
                  <span className="pandit-tag experience">{p.experienceYears} yrs</span>
                </div>
                <div className="pandit-tags">
                  {p.languages?.map((lang) => (
                    <span key={lang} className="pandit-tag lang">{lang}</span>
                  ))}
                  {p.specialties?.slice(0,2).map((sp) => (
                    <span key={sp} className="pandit-tag specialty">{sp}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {filteredPandits.length > 3 && (
          <div className="toggle-btn">
            <button onClick={() => setVisibleCount(v => v === 3 ? filteredPandits.length : 3)} className="custom-btn">
              {visibleCount === 3 ? 'Show More' : 'Show Less'}
            </button>
          </div>
        )}
      </section>

      {/* Bookings History */}
      <section id="booking" ref={bookingsRef} className="bookings-section" data-aos="fade-up">
        <h3>Your Bookings</h3>
        <div className="booking-grid">
          {filteredBookings.length === 0 ? (
            <p>No matching bookings found.</p>
          ) : (
            filteredBookings.map(b => (
              <motion.div
                key={b._id}
                className="booking-card new-booking-card"
                whileHover={{ scale: 1.025, boxShadow: '0 4px 24px #42a5f580' }}
              >
                <div className="booking-header">
                  <span className="booking-icon">📅</span>
                  <span className={`status-badge ${getStatusClass(b.status)}`}>{b.status}</span>
                </div>
                <div className="booking-body">
                  <p><strong>Service:</strong> {b.serviceid?.name || b.serviceid}</p>
                  <p><strong>Pandit:</strong> {b.panditid?.name || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
                  <p><strong>Time:</strong> {b.puja_time}</p>
                  <p><strong>Location:</strong> {b.location}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Reviews */}
      <section id="review" ref={reviewsRef} className="review-section" data-aos="fade-up">
        <h3>Submit a Review</h3>
        {reviewMessage && (
          <p className={reviewMessage.includes('submitted') ? 'success-message' : 'error-message review-message'}>{reviewMessage}</p>
        )}
        <form onSubmit={handleReviewSubmit} className="review-form review-card">
          <input type="text" value={review.name} disabled />
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={review.rating}
            onChange={e => setReview(prev => ({ ...prev, rating: e.target.value }))}
            min="1"
            max="5"
            required
          />
          <textarea
            placeholder="Write your feedback..."
            value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
            required
          />
          <button type="submit" className="custom-btn">Submit Review</button>
        </form>
      </section>
    </div>
  );
}

export default Dashboard;
