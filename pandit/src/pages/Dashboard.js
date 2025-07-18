import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';

// Sidebar Tasks
const tasks = [
  { label: 'Dashboard', icon: '🏠' },
  { label: 'My Profile', icon: '👤' },
  { label: 'Pandits', icon: '📿' },
  { label: 'Popular Poojas', icon: '🌟' },
  { label: 'Bookings', icon: '📅' },
  { label: 'Payments', icon: '💳' },
  { label: 'Logout', icon: '🚪' },
];

// Mock Data
const POPULAR_POOJAS = [
  { id: 1, name: "Grih Pravesh Puja", image: "/images/puja1.jpg" },
  { id: 2, name: "Satyanarayan Katha", image: "/images/puja2.jpg" },
  { id: 3, name: "Laxmi Puja", image: "/images/puja3.jpg" }
];

const RECENT_POOJAS = [
  "Amit in Pune booked Satyanarayan Katha",
  "Neha in Mumbai booked Grih Pravesh",
  "Priya in Delhi booked Laxmi Puja"
];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [search, setSearch] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [review, setReview] = useState({ name: '', rating: '', comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);
  const [expandedPandits, setExpandedPandits] = useState({});
  const [profile] = useState({ name: "Rohit Kumar", email: "rohit@example.com", city: "Lucknow", phone: "9999999999", pic: "" });
  const [showBooking, setShowBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ puja: '', date: '', time: '' });
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [confirmation, setConfirmation] = useState('');
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({ available: '', rating: '', poojaCount: '' });

  const sliderImages = ['/images/i2.jpeg', '/images/kalash.jpeg', '/images/havan.jpeg', '/images/i3.jpeg', '/images/i1.jpeg'];

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
    const interval = setInterval(() => setCarouselIndex(prev => (prev + 1) % sliderImages.length), 4000);
    return () => clearInterval(interval);
  }, []);

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

  const filteredPandits = pandits.filter(p => {
    const query = search.toLowerCase();
    let valid = p.name.toLowerCase().includes(query) || p.city?.toLowerCase().includes(query);
    if (filters.available !== '') valid = valid && String(p.available) === filters.available;
    if (filters.rating) valid = valid && p.rating >= Number(filters.rating);
    if (filters.poojaCount) valid = valid && p.poojaCount >= Number(filters.poojaCount);
    return valid;
  });

  const filteredBookings = bookings.filter(b => {
    const q = search.toLowerCase();
    return (
      b.panditid?.name?.toLowerCase().includes(q) ||
      b.serviceid?.name?.toLowerCase().includes(q) ||
      new Date(b.puja_date).toLocaleDateString().includes(q)
    );
  });

  const toggleExpand = (id) => {
    setExpandedPandits(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusClass = (status) => {
    if (status === 'Accepted') return 'status accepted';
    if (status === 'Rejected') return 'status rejected';
    return 'status pending';
  };

  const handleBookPandit = (pandit) => {
    setSelectedPandit(pandit);
    setShowBooking(true);
    setActiveSection('Bookings');
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setConfirmation(`Booking confirmed for "${bookingDetails.puja}" with ${selectedPandit.name} on ${bookingDetails.date}.`);
    setCart([...cart, { ...bookingDetails, pandit: selectedPandit }]);
    setShowBooking(false);
  };

  const paymentsData = [
    { month: 'April', amount: 1200 },
    { month: 'May', amount: 1600 },
    { month: 'June', amount: 900 }
  ];

  const handleNav = (section) => {
    if (section === 'Logout') {
      localStorage.clear();
      navigate('/home');
    } else {
      setActiveSection(section);
      setShowBooking(false);
      setConfirmation('');
    }
  };

  return (
    <div className="dashboard-grid">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="profile-panel">
          <img src={profile.pic || '/default-avatar.png'} alt="" className="profile-pic" />
          <h2>{user?.name || profile.name}</h2>
          <p>{user?.email || profile.email}</p>
          <p>{user?.city || profile.city}</p>
          <p>{user?.phone || profile.phone}</p>
        </div>
        <nav>
          <ul>
            {tasks.map(t => (
              <li
                key={t.label}
                className={`sidebar-item${activeSection === t.label ? ' active' : ''}`}
                onClick={() => handleNav(t.label)}
              >
                <span>{t.icon}</span> {t.label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="scrolling-ad">
          <marquee>
            {RECENT_POOJAS.map((item, idx) => (
              <span key={idx} className="ad-item">{item} &nbsp;|&nbsp;</span>
            ))}
          </marquee>
        </div>

        {/* Sections */}
        {activeSection === 'Dashboard' && (
          <section>
            <h1>Welcome to Shubhkarya, {user?.name || profile.name}!</h1>
            <p>Book verified Pandits and perform your rituals with ease.</p>
          </section>
        )}

        {activeSection === 'Pandits' && (
          <section>
            <h2>Browse Pandits</h2>
            <input
              type="text"
              placeholder="Search Pandits by name or city..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="booking-search"
            />
            <div className="filter-bar">
              <label>
                Min. Rating:
                <input type="number" value={filters.rating} onChange={e => setFilters(f => ({ ...f, rating: e.target.value }))} />
              </label>
              <label>
                Min. Pooja Count:
                <input type="number" value={filters.poojaCount} onChange={e => setFilters(f => ({ ...f, poojaCount: e.target.value }))} />
              </label>
            </div>
            <div className="pandit-list">
              {filteredPandits.slice(0, visibleCount).map(p => (
                <div key={p._id} className="pandit-card">
                  <img src={p.profile_photo_url || '/default-avatar.png'} alt={p.name} className="pandit-avatar" />
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.city}</p>
                    <p>Exp: {p.experienceYears} yrs</p>
                    <p>Languages: {p.languages?.join(', ')}</p>
                    <p>Specialties: {p.specialties?.join(', ')}</p>
                    <button onClick={() => handleBookPandit(p)}>Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'Bookings' && (
          <section>
            {showBooking && selectedPandit ? (
              <form className="booking-form" onSubmit={handleBookingSubmit}>
                <h3>Book {selectedPandit.name}</h3>
                <input type="text" placeholder="Pooja" required onChange={e => setBookingDetails(b => ({ ...b, puja: e.target.value }))} />
                <input type="date" required onChange={e => setBookingDetails(b => ({ ...b, date: e.target.value }))} />
                <input type="time" required onChange={e => setBookingDetails(b => ({ ...b, time: e.target.value }))} />
                <button type="submit">Confirm Booking</button>
              </form>
            ) : confirmation ? (
              <div className="confirmation-message">{confirmation}</div>
            ) : (
              <div>
                <h3>Your Bookings</h3>
                {filteredBookings.map(b => (
                  <div key={b._id} className="booking-card">
                    <div>{b.serviceid?.name || 'N/A'} on {new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}</div>
                    <div>Pandit: {b.panditid?.name}</div>
                    <div className={getStatusClass(b.status)}>{b.status}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activeSection === 'Payments' && (
          <section>
            <h2>Payment History</h2>
            <table className="payment-table">
              <thead><tr><th>Month</th><th>Amount</th></tr></thead>
              <tbody>
                {paymentsData.map((d, i) => (
                  <tr key={i}><td>{d.month}</td><td>₹{d.amount}</td></tr>
                ))}
              </tbody>
            </table>
            <h3>Cart</h3>
            <ul>
              {cart.map((c, i) => (
                <li key={i}>{c.puja} with {c.pandit.name} on {c.date} at {c.time}</li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === 'Popular Poojas' && (
          <section>
            <h2>Popular Poojas</h2>
            <div className="carousel">
              <button onClick={() => setCarouselIndex((carouselIndex - 1 + POPULAR_POOJAS.length) % POPULAR_POOJAS.length)}>‹</button>
              <div className="carousel-item">
                <img src={POPULAR_POOJAS[carouselIndex].image} alt={POPULAR_POOJAS[carouselIndex].name} />
                <h4>{POPULAR_POOJAS[carouselIndex].name}</h4>
                <button>Add to Cart</button>
              </div>
              <button onClick={() => setCarouselIndex((carouselIndex + 1) % POPULAR_POOJAS.length)}>›</button>
            </div>
          </section>
        )}

        {activeSection === 'My Profile' && (
          <section>
            <h2>My Profile</h2>
            <p><b>Name:</b> {user?.name}</p>
            <p><b>Email:</b> {user?.email}</p>
            <p><b>City:</b> {user?.city}</p>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
