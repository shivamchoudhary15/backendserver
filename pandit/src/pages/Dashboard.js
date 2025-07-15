// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [review, setReview] = useState({ name: '', rating: '', comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(3);

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
    } catch (err) {
      console.error('Error loading user:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const ratingVal = Number(review.rating);
    if (!review.name || !review.comment || isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return setReviewMessage('❌ Fill all fields. Rating must be 1–5.');
    }
    try {
      await createReview(review);
      setReviewMessage('✅ Review submitted!');
      setReview({ name: review.name, rating: '', comment: '' });
    } catch (err) {
      setReviewMessage('❌ Failed to submit review.');
    }
  };

  const filteredBookings = bookings.filter(b =>
    b.panditid?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.serviceid?.name?.toLowerCase().includes(search.toLowerCase()) ||
    new Date(b.puja_date).toLocaleDateString().includes(search)
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">Shubhkarya</h2>
        <ul>
          <li><strong>Bookings</strong></li>
          <li><strong>Reviews</strong></li>
          <li className="highlighted">Book a Service</li>
          <li onClick={handleLogout} className="logout-link">Logout</li>
        </ul>
      </aside>

      <main className="main-content">
        {user && (
          <div className="welcome-banner">
            <h1>Welcome to Shubhkarya, <span>{user.name}</span></h1>
            <p>Get ready to connect with spiritual guides and book services with ease.</p>
          </div>
        )}

        <div className="card-section">
          <div className="highlight-card">
            <img src="/images/pandit.jpeg" alt="Spiritual Guide" />
            <h4>4000+ Spiritual Guides</h4>
            <p>Pandits, Consultants & Religious Experts</p>
          </div>
          <div className="highlight-card">
            <img src="/images/kalash.jpeg" alt="Types of Puja" />
            <h4>500+ Types of Puja</h4>
            <p>All types of Vedic & spiritual puja</p>
          </div>
          <div className="highlight-card">
            <img src="/images/havan.jpeg" alt="Puja Count" />
            <h4>100000+ Pujas Done</h4>
            <p>By our verified community</p>
          </div>
        </div>

        <div className="section-block">
          <h3>Your Bookings</h3>
          <input
            className="booking-search"
            placeholder="Search by pandit, service or date"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="booking-list">
            {filteredBookings.map(b => (
              <div className="booking-card" key={b._id}>
                <p><strong>Service:</strong> {b.serviceid?.name || 'N/A'}</p>
                <p><strong>Pandit:</strong> {b.panditid?.name || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
                <p><strong>Time:</strong> {b.puja_time}</p>
                <p><strong>Location:</strong> {b.location}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="section-block">
          <h3>Submit a Review</h3>
          {reviewMessage && (
            <p className={reviewMessage.includes('✅') ? 'success-message' : 'error-message'}>
              {reviewMessage}
            </p>
          )}
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <label>Name: <input type="text" value={review.name} disabled /></label>
            <label>Rating (1-5): <input type="number" value={review.rating} onChange={e => setReview(prev => ({ ...prev, rating: e.target.value }))} /></label>
            <label>Comment: <textarea value={review.comment} onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))} /></label>
            <button type="submit" className="custom-btn">Submit</button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
