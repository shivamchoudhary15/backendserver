import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';

// --- IMPORTANT: DIRECT URL FOR SPIRITUAL BACKGROUND IMAGE IS NOW ACTIVE ---
const SPIRITUAL_BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1657651512394-259598dbba30?q=80&w=1460&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
// If this URL becomes unavailable, you might need to find a new one or use a local image.


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

        alert('✅ Login successful!');
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

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const formVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { delay: 0.3, duration: 0.5 } },
  };

  const buttonVariants = {
    hover: { scale: 1.02, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.25)' },
    tap: { scale: 0.98 },
  };

  const inputFocus = {
    boxShadow: '0 0 0 3px rgba(106, 5, 114, 0.2)', // Purple glow
    borderColor: '#6A0572',
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.overlay}></div>

      <motion.div
        style={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.form
          onSubmit={handleSubmit}
          style={styles.form}
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 style={styles.title}>🔐 Login to Your Account</h2>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              style={styles.errorMessage}
            >
              {error}
            </motion.p>
          )}

          <label style={styles.label}>Email Address</label>
          <motion.input
            name="email"
            type="email"
            placeholder="devotee@example.com"
            value={form.email}
            onChange={handleChange}
            required
            style={styles.input}
            whileFocus={inputFocus}
          />

          <label style={styles.label}>Password</label>
          <motion.input
            name="password"
            type="password"
            placeholder="********"
            value={form.password}
            onChange={handleChange}
            required
            style={styles.input}
            whileFocus={inputFocus}
          />

          <motion.button
            type="submit"
            style={styles.button}
            disabled={loading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {loading ? '🔄 Logging in...' : '🚀 Login'}
          </motion.button>

          <p style={styles.signupText}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.signupLink}>
              Sign Up Here
            </Link>
          </p>
          <p style={styles.signupText}>
            Are you a Pandit?{' '}
            <Link to="/signup-pandit" style={styles.signupLink}>
              Register as Pandit
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: `url(${SPIRITUAL_BACKGROUND_IMAGE}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    fontFamily: "'Roboto', sans-serif",
    color: '#333',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    zIndex: 1,
  },
  container: {
    position: 'relative',
    zIndex: 2,
    padding: '40px',
    maxWidth: '480px',
    width: '90%',
    margin: 'auto',
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    textAlign: 'center',
    color: '#6A0572',
    fontSize: '32px',
    marginBottom: '20px',
    fontFamily: "'Playfair Display', serif",
    fontWeight: 'bold',
    textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
  },
  label: {
    fontWeight: '600',
    color: '#4a4a4a',
    fontSize: '16px',
    marginBottom: '5px',
  },
  input: {
    padding: '14px 18px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  button: {
    marginTop: '15px',
    padding: '15px 25px',
    fontSize: '17px',
    backgroundColor: '#CD5C5C',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '700',
    letterSpacing: '0.5px',
    boxShadow: '0 5px 15px rgba(205, 92, 92, 0.3)',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#ffe6e6',
    border: '1px solid #dc3545',
    padding: '10px 15px',
    borderRadius: '8px',
    fontSize: '15px',
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: '500',
  },
  signupText: {
    textAlign: 'center',
    fontSize: '15px',
    color: '#555',
    marginTop: '15px',
  },
  signupLink: {
    color: '#8B4513',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.3s ease',
  },
};
