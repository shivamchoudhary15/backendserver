// BoltDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './BoltDashboard.css';
import { getUserTickets, getExperts, createFeedback, getUserStats, getNotifications } from '../api/api';
import ChatWindow from './ChatWindow';

// Lucide React icons
import {
  Home,
  Flash,
  MessageCircle,
  Users,
  CalendarDays,
  BarChart2,
  LogOut,
  Bell,
  User,
  CheckCircle,
  MoveRight,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', icon: <Home size={20} />, goto: '/' },
  { label: 'New Task', icon: <Flash size={20} />, goto: '/new-task' },
  { label: 'Feedback', icon: <MessageCircle size={20} />, goto: '#feedback' },
  { label: 'Experts', icon: <Users size={20} />, goto: '#experts' },
  { label: 'My Tickets', icon: <CalendarDays size={20} />, goto: '#tickets' },
  { label: 'Analytics', icon: <BarChart2 size={20} />, goto: '#analytics' },
  { label: 'Logout', icon: <LogOut size={20} />, goto: '/login', logout: true },
];

const SLIDER_IMAGES = [
  '/images/bolt-hero1.png',
  '/images/bolt-hero2.png',
  '/images/bolt-hero3.jpg'
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
            color={i <= rating ? "#ffd740" : "#e0e0e0"}
            fill={i <= rating ? "#ffd740" : "none"}
            size={24}
            style={{ marginRight: 2, verticalAlign: -5 }}
          />
        </span>
      ))}
    </div>
  );
}

export default function BoltDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [experts, setExperts] = useState([]);
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const [visibleExperts, setVisibleExperts] = useState(3);
  const [expandedExperts, setExpandedExperts] = useState({});
  const [searchExperts, setSearchExperts] = useState('');
  const [searchTickets, setSearchTickets] = useState('');

  const [feedback, setFeedback] = useState({ name: '', rating: 0, comment: '' });
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [showChatbot, setShowChatbot] = useState(false);
  const [chatExpertId, setChatExpertId] = useState(null);
  const [chatExpertName, setChatExpertName] = useState('');

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) return navigate('/login');
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFeedback(r => ({ ...r, name: parsedUser.name }));
      getUserTickets({ userid: parsedUser._id }).then(res => setTickets(res.data || []));
      getExperts().then(res => setExperts(res.data || []));
      getUserStats({ userid: parsedUser._id }).then(res => setStats(res.data || null));
      getNotifications({ userid: parsedUser._id }).then(res => setNotifications(res.data || []));
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

  async function handleFeedbackSubmit(e) {
    e.preventDefault();
    if (!feedback.name || !feedback.comment || !feedback.rating) {
      setFeedbackMsg('Please rate and share your feedback.');
      return;
    }
    setFeedbackLoading(true);
    try {
      await createFeedback(feedback);
      setFeedbackMsg('Thank you for sharing!');
      setFeedback(f => ({ name: f.name, rating: 0, comment: '' }));
    } catch {
      setFeedbackMsg('Submission error. Try again!');
    } finally {
      setFeedbackLoading(false);
      setTimeout(() => setFeedbackMsg(''), 2000);
    }
  }

  function toggleExpand(id) {
    setExpandedExperts(prev => ({ ...prev, [id]: !prev[id] }));
  }

  const filteredExperts = experts.filter(
    e =>
      e.name.toLowerCase().includes(searchExperts.toLowerCase()) ||
      (e.skills || '').toLowerCase().includes(searchExperts.toLowerCase())
  );

  const filteredTickets = tickets.filter(t => {
    const q = searchTickets.toLowerCase();
    return (
      (t.expertid?.name || '').toLowerCase().includes(q) ||
      (t.subject || '').toLowerCase().includes(q) ||
      new Date(t.created_at).toLocaleDateString().includes(q)
    );
  });

  const getStatusClass = status =>
    ({
      resolved: 'status accepted',
      open: 'status pending',
      closed: 'status rejected',
    }[(status || '').toLowerCase()] || 'status');

  function NotificationBell() {
    const unreadCount = notifications.filter(n => !n.read).length;
    return (
      <div className="notification-bell" aria-label={`You have ${unreadCount} notifications`}>
        <Bell size={22} strokeWidth={2.1} />
        {unreadCount > 0 && <span className="noti-badge">{unreadCount}</span>}
      </div>
    );
  }

  function AnalyticsPanel() {
    if (!stats) return null;
    return (
      <section id="analytics" className="analytics-panel" data-aos="fade-up">
        <h3 className="section-heading"><span>My Productivity at a Glance</span></h3>
        <div className="analytics-row">
          <div className="analytic-card">
            <BarChart2 color="#2586ff" size={19} style={{ marginBottom: "-4px", marginRight: 7 }} />
            <span className="analytic-label">Total Tickets</span>
            <span className="analytic-value">{stats.totalTickets}</span>
          </div>
          <div className="analytic-card">
            <CheckCircle color="#18b251" size={18} style={{ marginBottom: "-4px", marginRight: 7 }} />
            <span className="analytic-label">Resolved</span>
            <span className="analytic-value">{stats.resolvedTickets}</span>
          </div>
          <div className="analytic-card">
            <Flash color="#eebf04" size={18} style={{ marginBottom: "-4px", marginRight: 7 }} />
            <span className="analytic-label">Pending</span>
            <span className="analytic-value">{stats.openTickets}</span>
          </div>
          <div className="analytic-card">
            <CalendarDays color="#156fee" size={17} style={{ marginBottom: "-4px", marginRight: 7 }} />
            <span className="analytic-label">Avg. Res. Time</span>
            <span className="analytic-value">{stats.avgResolutionTime}h</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="dashboard-root bolt-dashboard-root">
      {/* NAVBAR */}
      <nav className={`dashboard-navbar${isNavbarOpen ? ' open' : ''}`}
        aria-label="Main Navigation"
        onMouseEnter={() => setIsNavbarOpen(true)}
        onMouseLeave={() => setIsNavbarOpen(false)}
      >
        <div className="navbar-brand" tabIndex={0}>
          <img src="/images/bolt-logo.png" alt="Bolt AI Logo" className="navbar-logo" />
          <span className="brand-accent neon-text">Bolt AI</span>
          <NotificationBell />
          <span className="navbar-expand-icon" aria-hidden="true">{isNavbarOpen ? '▲' : '▼'}</span>
        </div>
        <AnimatePresence>
          {isNavbarOpen && (
            <motion.ul
              className="navbar-menu"
              role="menu"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
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

      {/* WELCOME */}
      {user && (
        <section className="welcome-banner nice-glass" data-aos="fade">
          <h2>Welcome, <span>{user.name}</span>!</h2>
          <p>Your Official AI Productivity Workspace.</p>
        </section>
      )}

      {/* HERO + SLIDER */}
      <section className="dashboard-hero gradient-hero" id="dashboard" data-aos="fade-down">
        <div className="hero-main-row">
          <div>
            <h1 className="hero-title hero-text-glow">
              Harness the Power of <span>Bolt AI</span>
            </h1>
            <p className="hero-desc">
              Instantly connect to top AI experts. Create, track, and resolve your requests with one click.
            </p>
            <button className="hero-book-btn glow-btn"
              onClick={() => navigate('/new-task')}
              aria-label="Add New Task"
            ><Flash size={18} style={{marginBottom: "-4px", marginRight: 6}} /> Add New Task</button>
          </div>
          <div className="hero-slider slider-glow" data-aos="zoom-in">
            <div className="slider-frame shadow-pop">
              <img src={SLIDER_IMAGES[carouselIndex]} alt="AI Hero Slider" />
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

      {/* ANALYTICS */}
      <AnalyticsPanel />

      {/* EXPERTS */}
      <section id="experts" className="expert-section" data-aos="fade-up" tabIndex={-1} aria-label="AI Experts">
        <h3 className="section-heading">Connect with Experts</h3>
        <input
          type="text"
          className="booking-search"
          aria-label="Search experts"
          placeholder="Search by name or skill..."
          value={searchExperts}
          onChange={e => setSearchExperts(e.target.value)}
        />
        <div className="pandit-list">
          {filteredExperts.slice(0, visibleExperts).map(e => (
            <motion.div
              key={e._id}
              className="improved-pandit-card neon-card glass-highlight glossy shadow-pop"
              whileHover={{ y: -4, scale: 1.04 }}
              tabIndex={0}
              aria-expanded={expandedExperts[e._id]}
              onClick={() => toggleExpand(e._id)}
              onKeyDown={ev => (ev.key === 'Enter' || ev.key === ' ') && toggleExpand(e._id)}
            >
              <div className="pandit-avatar glass"
                style={{ backgroundImage: `url(${e.avatar_url || '/images/bolt-expert.png'})` }}
                aria-label={`Expert ${e.name}`}
              >
                <User color="#156fee" size={27} style={{background: "rgba(255,255,255,0.8)", borderRadius: "50%"}} />
              </div>
              <div className="pandit-main-info">
                <h4 className="pandit-name hero-text-glow"><Users size={16} style={{marginBottom:"-4px", marginRight:6}} /> {e.name}</h4>
                <div className="pandit-city">{e.skills?.join(', ') || 'Generalist'}</div>
              </div>
              {expandedExperts[e._id] && (
                <div className="pandit-extra expanded">
                  <div className="pandit-details">
                    <div className="pandit-badges">
                      <span className="pandit-badge exp">Exp: {e.experience} yrs</span>
                      <span className="pandit-badge langs">{e.languages?.join(', ')}</span>
                    </div>
                    <div className="pandit-specialties"><b>Specialties:</b> {e.specialties?.join(', ')}</div>
                  </div>
                </div>
              )}
              <button
                onClick={ev => {
                  ev.stopPropagation();
                  setChatExpertId(e._id);
                  setChatExpertName(e.name);
                }}
                style={{ marginTop: 8 }}
                className="custom-btn"
              ><MessageCircle size={16} style={{marginBottom:"-4px", marginRight:5}}/> Chat with Expert</button>
            </motion.div>
          ))}
        </div>
        {filteredExperts.length > visibleExperts && (
          <div className="toggle-btn">
            <button
              onClick={() => setVisibleExperts(v => (v === 3 ? filteredExperts.length : 3))}
              className="custom-btn glow-btn"
              aria-expanded={visibleExperts !== 3}
            >
              {visibleExperts === 3 ? <>Show More <MoveRight size={16} style={{marginLeft:4,marginBottom:-3}}/></> : 'Show Less'}
            </button>
          </div>
        )}
      </section>

      {/* Expert Chat */}
      {chatExpertId && (
        <ChatWindow
          userId={user?._id}
          expertId={chatExpertId}
          chatName={chatExpertName}
          onClose={() => setChatExpertId(null)}
        />
      )}

      {/* USER TICKETS */}
      <section id="tickets" className="bookings-section blur-bg" data-aos="fade-up" tabIndex={-1}
        aria-label="User Tickets/Tasks"
      >
        <h3 className="section-heading">My Tasks</h3>
        <input
          type="text"
          className="booking-search"
          aria-label="Search tasks"
          placeholder="Search tickets or requests..."
          value={searchTickets}
          onChange={e => setSearchTickets(e.target.value)}
        />
        <div className="booking-list">
          {filteredTickets.length === 0 ? (
            <p className="empty-msg">No tasks or tickets yet. Start a new task to see activity here!</p>
          ) : (
            filteredTickets.map(t => (
              <motion.div
                key={t._id}
                className="booking-card card-glossy glass neon-card shadow-pop"
                whileHover={{ scale: 1.032, boxShadow: '0 6px 32px #aecaee51' }}
                tabIndex={0}
                role="article"
                aria-label={`Task: ${t.subject} assigned to ${t.expertid?.name} on ${new Date(t.created_at).toLocaleDateString()}`}
              >
                <div className="booking-card-left">
                  <Flash size={23} color="#ffd740" style={{marginRight:9}} />
                  <div>
                    <div className="booking-type">{t.subject ?? 'General Query'}</div>
                    <div className="booking-date">{new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="booking-card-right">
                  <div className="booking-pandit">
                    <span className="booking-pandit-label">Expert:</span> <span>{t.expertid?.name ?? 'N/A'}</span>
                  </div>
                  <div className="booking-location">
                    Status: <span className={getStatusClass(t.status)}>{t.status}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* FEEDBACK */}
      <section id="feedback" className="review-section glass-review" data-aos="fade-up"
        tabIndex={-1} aria-label="Submit Feedback"
      >
        <h3 className="section-heading neon-text">Rate Bolt AI</h3>
        {feedbackMsg && (
          <p className={feedbackMsg.includes('Thank') ? 'success-message' : 'error-message'}>{feedbackMsg}</p>
        )}
        <form onSubmit={handleFeedbackSubmit}
          className="review-form card-glossy glass nice-glass"
          aria-label="Feedback form"
        >
          <div className="review-row">
            <input type="text" value={feedback.name} disabled className="review-input" aria-label="Your name" />
            <StarRating rating={feedback.rating} onChange={v => setFeedback(prev => ({ ...prev, rating: v }))} />
          </div>
          <textarea
            placeholder="Share your thoughts..."
            value={feedback.comment}
            onChange={e => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
            className="review-input review-textarea"
            required
            aria-required="true"
          />
          <button type="submit" className="custom-btn glow-btn" disabled={feedbackLoading}>
            {feedbackLoading ? <><Flash size={14} className="spin" /> Submitting...</> : <>Submit Feedback <MessageCircle size={15} style={{marginBottom:"-3px",marginLeft:2}}/></>}
          </button>
        </form>
      </section>

      {/* CHATBOT BUTTON */}
      <button aria-label="Toggle Chatbot"
        className="chatbot-toggle"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        {showChatbot ? '×'
          : <img src="/images/bolt-logo.png" alt="Open Chatbot" style={{ borderRadius: '50%', width: 38, height: 38 }} />
        }
      </button>
      {showChatbot && (
        <div className="chatbot-popup" role="dialog" aria-modal="true" aria-label="Chatbot window">
          <iframe
            title="Chatbot"
            src="https://your-chatbot-service-url/"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 15 }}
            allow="clipboard-write"
          />
        </div>
      )}
    </div>
  );
}
