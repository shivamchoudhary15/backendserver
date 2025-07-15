// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings } from '../api/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [review, setReview] = useState({ name: '', rating: '', comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [bookings, setBookings] = useState([]);

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

      getBookings({ userid: parsedUser._id })
        .then(res => {
          console.log('Bookings fetched:', res.data);
          setBookings(res.data);
        })
        .catch(err => console.error('Failed to fetch bookings:', err));
    } catch (err) {
      console.error('User parse error:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleBookingRedirect = () => navigate('/booking');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const ratingValue = Number(review.rating);
    if (!review.name || !review.comment || isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setReviewMessage('❌ Please fill all fields with a rating between 1 and 5.');
      return;
    }

    try {
      await createReview(review);
      setReviewMessage('✅ Review submitted!');
      setReview({ name: review.name, rating: '', comment: '' });
    } catch (error) {
      console.error('Error submitting review:', error);
      setReviewMessage('❌ Failed to submit review.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {user && (
        <div className="user-info">
          <p>Welcome, <strong>{user.name}</strong> ({user.email})</p>
        </div>
      )}

      <div className="button-group">
        <button className="custom-btn" onClick={handleBookingRedirect}>Book a Service</button>
        <button className="custom-btn" onClick={handleLogout}>Logout</button>
      </div>

      <hr />

      {/* Review Section */}
      <h3>Submit a Review</h3>
      {reviewMessage && (
        <p className={reviewMessage.startsWith('✅') ? 'success-message' : 'error-message'}>
          {reviewMessage}
        </p>
      )}
      <form onSubmit={handleReviewSubmit} className="review-form">
        <label>
          Name:
          <input type="text" name="name" value={review.name} disabled />
        </label>
        <label>
          Rating (1–5):
          <input
            type="number"
            name="rating"
            value={review.rating}
            onChange={e => setReview(prev => ({ ...prev, rating: e.target.value }))}
            min="1"
            max="5"
            required
          />
        </label>
        <label>
          Comment:
          <textarea
            name="comment"
            value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
            required
          />
        </label>
        <button type="submit" className="custom-btn">Submit Review</button>
      </form>

      {/* Highlights */}
      <div className="highlight-section">
        <div className="highlight-card">
          <img src="/images/pandit.jpeg" alt="Spiritual Guide" />
          <h4>4000+ Spiritual Guide</h4>
          <p>Priests, Pandits, Religious Experts & Consultants</p>
        </div>
        <div className="highlight-card">
          <img src="/images/kalash.jpeg" alt="Types of Puja" />
          <h4>500+ Types of Puja</h4>
          <p>500+ Types of Religious Services</p>
        </div>
        <div className="highlight-card">
          <img src="/images/havan.jpeg" alt="Puja Performed" />
          <h4>100000+ Puja Performed</h4>
          <p>4000+ Spiritual Guides performed more than 100000+ Puja</p>
        </div>
      </div>

      {/* Bookings */}
      {bookings.length > 0 && (
        <div className="bookings-section">
          <h3>Your Bookings</h3>
          {bookings.map(b => (
            <div key={b._id} className="booking-card">
              <p><strong>Service:</strong> {b.serviceid && typeof b.serviceid === 'object' ? b.serviceid.name : b.serviceid || 'N/A'}</p>
              <p><strong>Pandit:</strong> {b.panditid && typeof b.panditid === 'object' ? b.panditid.name : b.panditid || 'Not Assigned'}</p>
              <p><strong>Pooja:</strong> {b.poojaId && typeof b.poojaId === 'object' ? b.poojaId.name : b.poojaId || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(b.puja_date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {b.puja_time}</p>
              <p><strong>Location:</strong> {b.location}</p>
              <p><strong>Status:</strong> {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
