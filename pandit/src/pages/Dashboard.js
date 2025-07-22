import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';

// Navbar
const navbarButtons = [
  { label: 'Home', icon: '🏠', goto: '/' },
  { label: 'Book New Puja', icon: '🛕', goto: '/booking' },
  { label: 'Submit Review', icon: '💬', goto: '#review' },
  { label: 'View Our Pandit', icon: '📿', goto: '#pandit' },
  { label: 'Search for Puja', icon: '🔍', goto: '#highlight' },
  { label: 'Booking History', icon: '📅', goto: '#booking' },
  { label: 'Logout', icon: '🚪', goto: '/home', logout: true },
];

// Hero/slider images
const sliderImages = [
  '/images/i2.jpeg',
  '/images/kalash.jpeg',
  '/images/havan.jpeg',
  '/images/i3.jpeg',
  '/images/i1.jpeg',
];

// Star rating component
function StarRating({ rating, onChange }) {
  return (
    <div className="star-rating" aria-label="Rating">
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          tabIndex={0}
          onClick={() => onChange(i)}
          onKeyPress={e => (e.key === "Enter" || e.key === " ") && onChange(i)}
          className={i <= rating ? 'star active' : 'star'}
          role="button"
          aria-label={`Rate ${i} star${i>1?'s':''}`}
        >★</span>
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

  // Chatbase popup state
  const [showChatbot, setShowChatbot] = useState(false);

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

  return (
    <div className="dashboard-root">
      {/* NAVBAR */}
      {/* ...all your dashboard sections stay here... */}

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
            {reviewLoading ? 'Submitting...' : <>Submit Review <span role="img" aria-label="Review">💬</span></>}
          </button>
        </form>
      </section>

      {/* --- CHATBASE ROUND BUTTON & POPUP CHATBOT --- */}
      <button
        aria-label="Open Chatbase chatbot"
        style={{
          position: 'fixed',
          bottom: 26,
          right: 26,
          zIndex: 10011,
          width: 62,
          height: 62,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #2786EF, #31C7EC 90%)',
          boxShadow: '0 4px 24px rgba(38,82,132,0.11)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
          transition: 'box-shadow 0.18s'
        }}
        onClick={() => setShowChatbot((s) => !s)}
      >
        {showChatbot ? (
          <span style={{ fontSize: 44, fontWeight: 700, color: "#fff", marginTop: -2 }}>×</span>
        ) : (
          <img
            src="/images/subh.png"
            alt="Open Chatbot"
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover",
              display: "block",
              background: "#fff"
            }}
          />
        )}
      </button>
      {showChatbot && (
        <div
          style={{
            position: 'fixed',
            bottom: 100,
            right: 28,
            width: 350,
            height: 480,
            background: '#fff',
            borderRadius: 15,
            boxShadow: '0 6px 32px 0 rgba(0,0,0,0.24)',
            zIndex: 10010,
            overflow: 'hidden',
            animation: 'fadeInChatbase .28s'
          }}
        >
          <iframe
            title="Chatbase Chatbot"
            src="https://www.chatbase.co/chatbot-iframe/c4lNDmZCNJ6CrCZIHtcg7"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 15,
              background: 'transparent'
            }}
            allow="clipboard-write"
          />
        </div>
      )}
      <style>
        {`
          @keyframes fadeInChatbase {
            from { opacity: 0; transform: translateY(30px);}
            to   { opacity:1; transform: none;}
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
