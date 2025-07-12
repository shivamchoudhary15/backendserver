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

    if (!token) return navigate('/login');

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setReview(prev => ({ ...prev, name: parsedUser.name }));
      getBookings(parsedUser._id).then(res => setBookings(res.data));
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const handleBookingRedirect = () => navigate('/booking');
  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
  };

  const handleReviewSubmit = async e => {
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
    } catch {
      setReviewMessage('❌ Failed to submit review.');
    }
  };

  return (
    <div className="dashboard-container">
      <h2>📊 Dashboard</h2>

      {user && (
        <div className="user-info">
          <p>Welcome, <strong>{user.name}</strong> ({user.email})</p>
        </div>
      )}

      <div className="button-group">
        <button className="custom-btn" onClick={handleBookingRedirect}>📅 Book a Service</button>
        <button className="custom-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      <hr />

      <h3>✍️ Submit a Review</h3>
      {reviewMessage && (
        <p className={reviewMessage.startsWith('✅') ? 'success-message' : 'error-message'}>{reviewMessage}</p>
      )}
      <form onSubmit={handleReviewSubmit} className="review-form">
        <label>Name:
          <input type="text" name="name" value={review.name} disabled/>
        </label>
        <label>Rating (1–5):
          <input type="number" name="rating" value={review.rating}
            onChange={e => setReview(prev => ({ ...prev, rating: e.target.value }))} min="1" max="5" required/>
        </label>
        <label>Comment:
          <textarea name="comment" value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))} required/>
        </label>
        <button type="submit" className="custom-btn">📝 Submit Review</button>
      </form>

      {bookings.length > 0 && (
        <div className="bookings-section">
          <h3>Your Bookings</h3>
          {bookings.map(b => (
            <div key={b._id} className="booking-card">
              <p><strong>Pandit:</strong> {b.panditid.name}</p>
              <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
              <p><strong>Status:</strong> {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
