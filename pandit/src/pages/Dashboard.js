import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview } from '../api/api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [review, setReview] = useState({ name: '', rating: '', comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setReview((prev) => ({ ...prev, name: parsedUser.name }));
      } catch (err) {
        console.error('Failed to parse user data');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleBookingRedirect = () => {
    navigate('/booking');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/home');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const { name, rating, comment } = review;
    const ratingValue = Number(rating);

    if (!name || !comment || isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setReviewMessage('❌ Please fill all fields with a rating between 1 and 5.');
      return;
    }

    try {
      await createReview({ name, rating: ratingValue, comment });
      setReviewMessage('✅ Review submitted!');
      setReview({ name, rating: '', comment: '' });
    } catch (err) {
      console.error('Review error:', err);
      setReviewMessage('❌ Failed to submit review.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>📊 Dashboard</h2>

      {user && (
        <div style={{ marginBottom: '20px' }}>
          <p>
            Welcome, <strong>{user.name}</strong> ({user.email})
          </p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleBookingRedirect}>📅 Book a Service</button>
        <button
          onClick={handleLogout}
          style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
        >
          🚪 Logout
        </button>
      </div>

      <hr />
      <h3>✍️ Submit a Review</h3>
      {reviewMessage && <p>{reviewMessage}</p>}

      <form onSubmit={handleReviewSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={review.name}
            onChange={(e) => setReview({ ...review, name: e.target.value })}
            required
          />
        </label>
        <br />

        <label>
          Rating (1–5):
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: e.target.value })}
            required
          />
        </label>
        <br />

        <label>
          Comment:
          <textarea
            name="comment"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            required
          />
        </label>
        <br />

        <button type="submit">📝 Submit Review</button>
      </form>
    </div>
  );
}

export default Dashboard;




