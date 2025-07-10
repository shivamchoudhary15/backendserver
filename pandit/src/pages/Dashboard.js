import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview } from '../api/api';
import { motion } from 'framer-motion';
import './Dashboard.css'; // Updated CSS with animations and styles

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
    <motion.div
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        style={styles.heading}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        📊 Dashboard
      </motion.h2>

      {user && (
        <div style={styles.userInfo}>
          <p>
            Welcome, <strong>{user.name}</strong> ({user.email})
          </p>
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button className="custom-btn" onClick={handleBookingRedirect}>
          📅 Book a Service
        </button>
        <button className="custom-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

      <div style={styles.buttonGroup}>
        <button className="custom-btn" onClick={() => navigate('/join-devotee')}>
          🙏 Join as Devotee
        </button>
        <button className="custom-btn" onClick={() => navigate('/register-pandit')}>
          📿 Register as Pandit
        </button>
      </div>

      <hr style={{ margin: '30px 0' }} />
      <h3 style={styles.reviewHeading}>✍️ Submit a Review</h3>

      {reviewMessage && (
        <p className={reviewMessage.includes('✅') ? 'success-message' : 'error-message'}>
          {reviewMessage}
        </p>
      )}

      <motion.form
        onSubmit={handleReviewSubmit}
        style={styles.form}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <label style={styles.label}>
          Name:
          <input
            type="text"
            name="name"
            value={review.name}
            disabled
            style={styles.input}
          />
        </label>

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

        <button type="submit" className="custom-btn">
          📝 Submit Review
        </button>
      </motion.form>
    </motion.div>
  );
}

const styles = {
  container: {
    padding: '30px',
    maxWidth: '650px',
    margin: '40px auto',
    fontFamily: 'Segoe UI, sans-serif',
    background: 'linear-gradient(to right, #ffffff, #f7f9fc)',
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
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
  reviewHeading: {
    fontSize: '22px',
    marginBottom: '10px',
    color: '#34495e',
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


// export default Dashboard;



