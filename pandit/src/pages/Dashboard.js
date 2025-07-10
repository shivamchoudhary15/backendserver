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
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Dashboard</h2>

      {user && (
        <div style={{ marginBottom: '20px' }}>
        <div style={styles.userInfo}>
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
      <div style={styles.buttonGroup}>
        <button style={styles.primaryButton} onClick={handleBookingRedirect}>
          📅 Book a Service
        </button>
        <button style={styles.logoutButton} onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <hr />
      <h3>✍️ Submit a Review</h3>
      {reviewMessage && <p>{reviewMessage}</p>}
      <hr style={{ margin: '30px 0' }} />
      <h3 style={styles.reviewHeading}>✍️ Submit a Review</h3>
      {reviewMessage && <p style={styles.message}>{reviewMessage}</p>}

      <form onSubmit={handleReviewSubmit}>
        <label>
      <form onSubmit={handleReviewSubmit} style={styles.form}>
        <label style={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            value={review.name}
            onChange={(e) => setReview({ ...review, name: e.target.value })}
            required
            style={styles.input}
            disabled
          />
        </label>
        <br />

        <label>
        <label style={styles.label}>
          Rating (1–5):
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={review.rating}
            onChange={(e) => setReview({ ...review, rating: e.target.value })}
            required
            style={styles.input}
          />
        </label>
        <br />

        <label>
        <label style={styles.label}>
          Comment:
          <textarea
            name="comment"
            value={review.comment}
            onChange={(e) => setReview({ ...review, comment: e.target.value })}
            required
            style={styles.textarea}
          />
        </label>
        <br />

        <button type="submit">📝 Submit Review</button>
        <button type="submit" style={styles.primaryButton}>
          📝 Submit Review
        </button>
      </form>
    </div>
  );
}

export default Dashboard;
const styles = {
  container: {
    padding: '30px',
    maxWidth: '600px',
    margin: 'auto',
    fontFamily: 'Segoe UI, sans-serif',
    background: '#fefefe',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  userInfo: {
    background: '#eaf3ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    color: '#2e4053',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    gap: '10px',
  },
  primaryButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#2c7be5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  logoutButton: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  reviewHeading: {
    fontSize: '22px',
    marginBottom: '10px',
    color: '#34495e',
  },
  message: {
    color: '#16a085',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    marginTop: '5px',
    width: '100%',
    fontSize: '15px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minHeight: '80px',
    marginTop: '5px',
    width: '100%',
    fontSize: '15px',
  },
};

export default Dashboard;


