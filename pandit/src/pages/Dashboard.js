import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const bookingsRef = useRef(null);
  const reviewsRef = useRef(null);

  const [user, setUser] = useState(null);
  const [review, setReview] = useState({ name: '', rating: '', comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [pandits, setPandits] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);
  const [expandedPandits, setExpandedPandits] = useState({});
  const [activeSidebar, setActiveSidebar] = useState('dashboard');
  const [announcement, setAnnouncement] = useState(
    "Get ₹50 OFF your first puja booking! Use code: SHUBH50"
  );

  useEffect(() => {
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

  const handleSidebarClick = (section) => {
    setActiveSidebar(section);
    if (section === 'dashboard') window.scrollTo(0, 0);
    else if (section === 'bookings') bookingsRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (section === 'reviews') reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
    else if (section === 'book') navigate('/booking');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
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

  const toggleExpand = (id) => {
    setExpandedPandits(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo-section">
          <img src="/images/subh.png" alt="Shubhkarya" className="sidebar-logo"/>
          <h2>Shubhkarya</h2>
        </div>
        <SidebarButton label="Dashboard Home" icon="🏠" active={activeSidebar==="dashboard"} onClick={()=>handleSidebarClick('dashboard')}/>
        <SidebarButton label="Bookings" icon="📅" pop={!!bookings.length} active={activeSidebar==="bookings"} onClick={()=>handleSidebarClick('bookings')}/>
        <SidebarButton label="Reviews" icon="💬" active={activeSidebar==="reviews"} onClick={()=>handleSidebarClick('reviews')}/>
        <SidebarButton label="Book a Service" icon="🛕" highlight onClick={()=>handleSidebarClick('book')}/>
        <button className="logout-btn" onClick={handleLogout}><span role="img" aria-label="">🚪</span> Logout</button>
        <div className="sidebar-announcement animated-pop">{announcement}</div>
      </aside>

      <main className="main-content">
        {user && (
          <div className="welcome-section animated-fade-up">
            <h2>Welcome, {user.name}</h2>
            <p>Find trusted <b>pandits</b>, <b>book pujas</b> for every occasion, <br/>and manage your spiritual journey with ease.</p>
          </div>
        )}

        {/* Quick Actions Section */}
        <section className="quick-actions animated-fade-in">
          <button className="action-card" onClick={()=>navigate('/booking')}>+ New Puja Booking</button>
          <button className="action-card" onClick={()=>handleSidebarClick('bookings')}>📅 View My Bookings</button>
          <button className="action-card highlight-action" onClick={()=>navigate('/profile')}>👤 My Profile</button>
        </section>

        {/* Announcement / Info Section */}
        <section className="dashboard-info animated-info">
          <img src="/images/kalash.jpeg" alt="Kalash" className="info-img"/>
          <div>
            <h4>✨ <span className="highlight-text">Special Festive Offers!</span></h4>
            <ul>
              <li>Get ₹50 off your first home puja.</li>
              <li>Refer friends &amp; earn rewards.</li>
              <li>24/7 WhatsApp support for all religious queries.</li>
            </ul>
          </div>
        </section>

        {/* Highlight Section */}
        <section className="highlight-section animated-fade-in">
          <div className="highlight-card" style={{ backgroundImage: "url('/images/india.jpeg')" }}>
            <div className="highlight-content">
              <h4>Spiritual Guides</h4>
              <p>Pandits & Consultants across India</p>
              <p>250+ Experts</p>
            </div>
          </div>
          <div className="highlight-card" style={{ backgroundImage: "url('/images/kalash.jpeg')" }}>
            <div className="highlight-content">
              <h4>Religious Services</h4>
              <p>Wide variety of pujas</p>
              <p>100+ Pujas</p>
            </div>
          </div>
          <div className="highlight-card" style={{ backgroundImage: "url('/images/havan.jpeg')" }}>
            <div className="highlight-content">
              <h4>Pujas Done</h4>
              <p>Performed by verified pandits</p>
              <p>1,000+ Completed</p>
            </div>
          </div>
        </section>

        {/* Why Shubhkarya */}
        <section className="why-shubhkarya-section animated-fade-up">
          <h3>Why Choose Shubhkarya?</h3>
          <ul>
            <li><strong>Verified Pandits:</strong> All experts are background-checked and reviewed.</li>
            <li><strong>Pan India Services:</strong> Metropolitan & local experts in every state.</li>
            <li><strong>Transparent Pricing:</strong> No hidden charges, clear billing.</li>
            <li><strong>Personalized Guidance:</strong> Book by tradition, date, or language.</li>
          </ul>
        </section>

        {/* Pandit Section */}
        <section className="pandit-section animated-fade-in">
          <h3>Verified Pandits</h3>
          <input
            type="text"
            className="booking-search"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="pandit-list">
            {filteredPandits.slice(0, visibleCount).map(p => (
              <div key={p._id} className="pandit-card animated-card-hover">
                <h4 className="pandit-name" onClick={() => toggleExpand(p._id)}>{p.name}</h4>
                {expandedPandits[p._id] && (
                  <div className="pandit-details">
                    <img src={p.profile_photo_url || '/images/default.jpg'} alt={p.name} />
                    <p><strong>City:</strong> {p.city}</p>
                    <p><strong>Experience:</strong> {p.experienceYears} yrs</p>
                    <p><strong>Languages:</strong> {p.languages?.join(', ')}</p>
                    <p><strong>Specialties:</strong> {p.specialties?.join(', ')}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          {filteredPandits.length > 3 && (
            <div className="toggle-btn">
              <button
                onClick={() => setVisibleCount(prev => prev === 3 ? filteredPandits.length : 3)}
                className="custom-btn"
              >
                {visibleCount === 3 ? 'Show More' : 'Show Less'}
              </button>
            </div>
          )}
        </section>

        {/* Bookings Section */}
        <section ref={bookingsRef} className="bookings-section animated-fade-up">
          <h3>Your Bookings</h3>
          <div className="booking-list">
            {filteredBookings.length === 0 ? (
              <p>No matching bookings found.</p>
            ) : (
              filteredBookings.map(b => (
                <div key={b._id} className="booking-card animated-card-hover">
                  <p><strong>Service:</strong> {b.serviceid?.name || b.serviceid}</p>
                  <p><strong>Pandit:</strong> {b.panditid?.name || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
                  <p><strong>Time:</strong> {b.puja_time}</p>
                  <p><strong>Location:</strong> {b.location}</p>
                  <p><strong>Status:</strong> <span className={getStatusClass(b.status)}>{b.status}</span></p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Review Section */}
        <section ref={reviewsRef} className="review-section animated-fade-in">
          <h3>Submit a Review</h3>
          {reviewMessage && (
            <p className={reviewMessage.includes('submitted') ? 'success-message' : 'error-message'}>{reviewMessage}</p>
          )}
          <form onSubmit={handleReviewSubmit} className="review-form">
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
      </main>
    </div>
  );
}

// POP Sidebar Button (with animated pulse for active/pop)
function SidebarButton({label, icon, pop, highlight, active, onClick}) {
  return (
    <button
      className={`sidebar-btn${active?" active":""}${highlight?" highlight":""}${pop?" pop-anim":""}`}
      onClick={onClick}
      tabIndex={0}
    >
      <span className="sidebar-icon">{icon}</span>
      <span>{label}</span>
      {pop && <span className="pop-dot"></span>}
    </button>
  );
}

export default Dashboard;
