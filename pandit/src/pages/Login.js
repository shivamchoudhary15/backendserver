import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';

// Logo image path (place subh.png inside public/images/)
const SHUBHKARYA_LOGO_PATH = '/images/subh.png';

// Background image (optional)
const SPIRITUAL_BACKGROUND_IMAGE = 'https://plus.unsplash.com/premium_photo-1716903508664-8e23f6ba4331?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const PRIMARY_BUTTON_GRADIENT = 'linear-gradient(145deg, #CD5C5C 0%, #FF6347 100%)';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(form);
      const { token, user } = response.data;

      if (token && user?._id) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        alert('✅ Login successful! Redirecting...');
        navigate('/dashboard');
      } else {
        setError('Invalid login response. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || '❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      style={styles.pageWrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div style={styles.overlay}></div>

      <motion.div
        style={styles.container}
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 12, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.logoPlaceholder}>
            <img
              src={SHUBHKARYA_LOGO_PATH}
              alt="ShubhKarya Logo"
              style={styles.shubhKaryaLogo}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default.jpg';
              }}
            />
            <p style={styles.subtitle}>Your Path to Sacred Beginnings</p>
          </div>

          {error && (
            <p style={styles.errorMessage}>{error}</p>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <motion.button
            type="submit"
            style={styles.button}
            disabled={loading}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>

          <p style={styles.signupText}>
            Don’t have an account?{' '}
            <Link to="/signup" style={styles.signupLink}>
              Sign Up Here →
            </Link>
          </p>
          <p style={styles.signupText}>
            Are you a Pandit?{' '}
            <Link to="/signup/pandit" style={styles.signupLink}>
              Register as Pandit →
            </Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: `url(${SPIRITUAL_BACKGROUND_IMAGE}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    fontFamily: "'Roboto', sans-serif",
  },
  overlay: {
    display: 'none',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    border: '3px solid #FFD700',
    borderRadius: '30px',
    padding: '50px 40px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 0 30px rgba(255, 215, 0, 0.5)',
    backdropFilter: 'blur(12px)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  logoPlaceholder: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  shubhKaryaLogo: {
    width: '130px',
    borderRadius: '15px',
    border: '4px solid #FFD700',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    fontWeight: '500',
    marginTop: '10px',
  },
  errorMessage: {
    color: '#c0392b',
    backgroundColor: '#ffe6e6',
    padding: '12px 20px',
    borderRadius: '10px',
    textAlign: 'center',
    fontWeight: '600',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '16px',
    backgroundImage: 'linear-gradient(to right, #ff9966, #ff5e62)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  input: {
    padding: '14px 18px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    outline: 'none',
    transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
  },
  button: {
    marginTop: '20px',
    padding: '16px',
    fontSize: '18px',
    background: PRIMARY_BUTTON_GRADIENT,
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    boxShadow: '0 6px 20px rgba(205, 92, 92, 0.4)',
    transition: 'all 0.3s ease',
  },
  signupText: {
    textAlign: 'center',
    fontSize: '15px',
    color: '#555',
    marginTop: '10px',
  },
  signupLink: {
    color: '#c0392b',
    textDecoration: 'none',
    fontWeight: '600',
  },
};
