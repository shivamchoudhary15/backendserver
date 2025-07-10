import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';

// Using the direct URL for the spiritual background image
const SPIRITUAL_BACKGROUND_IMAGE = 'https://plus.unsplash.com/premium_photo-1716903508664-8e23f6ba4331?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

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

  // Framer Motion Variants for more intricate animations
  const pageWrapperVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const formContainerVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 10,
        delay: 0.3, // Delay for the whole form to appear after background
      },
    },
  };

  const formItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      boxShadow: '0px 10px 25px rgba(205, 92, 92, 0.4)', // Deeper shadow on hover
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.97 },
  };

  const inputFocus = {
    boxShadow: '0 0 0 4px rgba(106, 5, 114, 0.3)', // Larger, softer purple glow
    borderColor: '#6A0572',
    transition: { duration: 0.2 }
  };

  return (
    <motion.div
      style={styles.pageWrapper}
      variants={pageWrapperVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={styles.overlay}></div>

      <motion.div
        style={styles.container}
        variants={formContainerVariants}
      >
        <motion.div style={styles.form} variants={formItemVariants}>
          <div style={styles.logoPlaceholder}>
            <span style={styles.logoIcon}><i className="fas fa-om"></i></span> {/* Om icon */}
            <h2 style={styles.title}>Pandit Booking</h2>
            <p style={styles.subtitle}>Welcome Back, Devotee!</p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }} // Animation for disappearing error
              transition={{ duration: 0.3 }}
              style={styles.errorMessage}
            >
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
              {error}
            </motion.p>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <i className="fas fa-envelope" style={styles.icon}></i> Email Address
            </label>
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
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <i className="fas fa-lock" style={styles.icon}></i> Password
            </label>
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
          </div>

          <motion.button
            type="submit"
            style={styles.button}
            disabled={loading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Logging in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i> Login
              </>
            )}
          </motion.button>

          <p style={styles.signupText}>
            Don't have an account?{' '}
            <Link to="/signup" style={styles.signupLink}>
              Sign Up Here <i className="fas fa-arrow-right" style={{ marginLeft: '5px' }}></i>
            </Link>
          </p>
          <p style={styles.signupText}>
            Are you a Pandit?{' '}
            <Link to="/signup-pandit" style={styles.signupLink}>
              Register as Pandit <i className="fas fa-arrow-right" style={{ marginLeft: '5px' }}></i>
            </Link>
          </p>
        </motion.form>
      </motion.div>
    </motion.div>
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)', // Slightly more opaque overlay for content focus
    zIndex: 1,
  },
  container: {
    position: 'relative',
    zIndex: 2,
    padding: '40px 50px', // More horizontal padding
    maxWidth: '500px', // Slightly wider container
    width: '90%',
    margin: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '20px', // More rounded
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)', // Deeper, softer shadow
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px', // More space between elements
  },
  logoPlaceholder: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logoIcon: {
    fontSize: '55px', // Larger icon
    color: '#6A0572', // Deep purple
    marginBottom: '10px',
    display: 'block', // Ensures margin works
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '38px', // Larger, more impactful title
    color: '#8B4513', // SaddleBrown
    fontWeight: 'bold',
    marginBottom: '5px',
    textShadow: '1px 1px 3px rgba(0,0,0,0.08)',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#ffe6e6',
    border: '1px solid #dc3545',
    padding: '12px 20px', // More padding
    borderRadius: '10px', // More rounded
    fontSize: '15px',
    textAlign: 'center',
    marginBottom: '15px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Space between label and input
  },
  label: {
    fontWeight: '600',
    color: '#4A4A4A', // Slightly darker grey
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '10px',
    color: '#6A0572', // Deep purple for icons
    fontSize: '18px',
  },
  input: {
    padding: '16px 20px', // Increased padding for a more substantial feel
    fontSize: '17px', // Slightly larger font
    borderRadius: '12px', // More rounded
    border: '1px solid #e0e0e0', // Lighter, subtle border
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    width: 'calc(100% - 40px)', // Adjust width for padding
    boxSizing: 'border-box', // Include padding in width
  },
  button: {
    marginTop: '25px', // More space above button
    padding: '16px 30px', // Larger padding
    fontSize: '18px', // Larger font
    background: 'linear-gradient(135deg, #CD5C5C 0%, #FF6347 100%)', // IndianRed to Tomato gradient
    color: 'white',
    border: 'none',
    borderRadius: '35px', // More pill-shaped
    cursor: 'pointer',
    fontWeight: '700',
    letterSpacing: '0.8px', // Tighter spacing
    boxShadow: '0 6px 20px rgba(205, 92, 92, 0.4)', // Initial shadow
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    textAlign: 'center',
    fontSize: '15px',
    color: '#666',
    marginTop: '18px', // More space between sections
  },
  signupLink: {
    color: '#8B4513', // SaddleBrown for links
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'color 0.3s ease, text-decoration 0.3s ease',
  },
};
