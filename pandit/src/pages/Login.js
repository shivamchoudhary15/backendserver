import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';

// Background image (can be changed)
const SPIRITUAL_BACKGROUND_IMAGE =
  'https://plus.unsplash.com/premium_photo-1716903508664-8e23f6ba4331?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
// --- Direct URL for spiritual background image ---
// If you find an even higher resolution/clearer image, update this URL.
const SPIRITUAL_BACKGROUND_IMAGE = 'https://plus.unsplash.com/premium_photo-1716903508664-8e23f6ba4331?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// --- Custom gradient for the submit button ---
const PRIMARY_BUTTON_GRADIENT = 'linear-gradient(145deg, #CD5C5C 0%, #FF6347 100%)'; // IndianRed to Tomato

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

  // Framer Motion Variants
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
        delay: 0.3,
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
      boxShadow: '0px 10px 25px rgba(205, 92, 92, 0.4)',
      transition: { duration: 0.2 },
      boxShadow: '0px 12px 30px rgba(205, 92, 92, 0.5)', // Deeper, more vibrant shadow on hover
      background: 'linear-gradient(145deg, #FF6347 0%, #CD5C5C 100%)', // Reverse gradient on hover
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.97 },
  };

  const inputFocus = {
    boxShadow: '0 0 0 4px rgba(106, 5, 114, 0.3)',
    boxShadow: '0 0 0 5px rgba(106, 5, 114, 0.35)', // Larger, more pronounced glow
    borderColor: '#6A0572',
    transition: { duration: 0.2 },
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

      <motion.div style={styles.container} variants={formContainerVariants}>
      <motion.div
        style={styles.container}
        variants={formContainerVariants}
      >
        <motion.form
          onSubmit={handleSubmit}
          style={styles.form}
          variants={formItemVariants}
          onSubmit={handleSubmit}
          initial="hidden"
          animate="visible"
        >
          <div style={styles.logoPlaceholder}>
            <span style={styles.logoIcon}>
              <i className="fas fa-om"></i>
            </span>
            <h2 style={styles.title}>Pandit Booking</h2>
            <p style={styles.subtitle}>Welcome Back, Devotee!</p>
            <span style={styles.logoIcon}><i className="fas fa-om"></i></span>
            <h2 style={styles.title}>ShubhKarya</h2> {/* Startup name: ShubhKarya */}
            <p style={styles.subtitle}>Your Path to Sacred Beginnings</p> {/* New tagline */}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    backgroundColor: 'rgba(255, 255, 255, 0.82)', // Reduced opacity for more background image clarity
    zIndex: 1,
    backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.92) 100%)', // Subtle radial gradient
  },
  container: {
    position: 'relative',
    zIndex: 2,
    padding: '40px 50px',
    maxWidth: '500px',
    padding: '45px 55px', // Increased padding for more luxurious feel
    maxWidth: '520px', // Slightly wider
    width: '90%',
    margin: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    backgroundColor: '#ffffff', // Clean white background for the form card
    borderRadius: '25px', // Even more rounded corners
    boxShadow: '0 25px 60px rgba(0,0,0,0.25)', // Deeper, more elegant shadow
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
    gap: '24px', // More space between elements
  },
  logoPlaceholder: {
    textAlign: 'center',
    marginBottom: '30px',
    marginBottom: '35px',
  },
  logoIcon: {
    fontSize: '55px',
    color: '#6A0572',
    marginBottom: '10px',
    fontSize: '60px', // Larger icon for more presence
    color: '#6A0572', // Deep purple
    marginBottom: '12px',
    display: 'block',
    textShadow: '2px 2px 5px rgba(0,0,0,0.1)', // Subtle shadow for icon
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '38px',
    color: '#8B4513',
    fontSize: '42px', // Larger, more impactful title for ShubhKarya
    color: '#8B4513', // SaddleBrown
    fontWeight: 'bold',
    marginBottom: '5px',
    textShadow: '1px 1px 3px rgba(0,0,0,0.08)',
    marginBottom: '8px',
    textShadow: '1px 1px 4px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '20px',
    fontStyle: 'italic',
    fontSize: '19px', // Slightly larger subtitle
    color: '#666',
    marginBottom: '25px',
    fontStyle: 'normal',
    fontWeight: '500',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#ffe6e6',
    border: '1px solid #dc3545',
    padding: '12px 20px',
    borderRadius: '10px',
    fontSize: '15px',
    padding: '14px 22px',
    borderRadius: '12px',
    fontSize: '16px',
    textAlign: 'center',
    marginBottom: '15px',
    marginBottom: '18px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    gap: '10px',
  },
  label: {
    fontWeight: '600',
    color: '#4A4A4A',
    fontSize: '16px',
    fontSize: '17px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: '10px',
    marginRight: '12px',
    color: '#6A0572',
    fontSize: '18px',
    fontSize: '20px',
  },
  input: {
    padding: '16px 20px',
    fontSize: '17px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    padding: '18px 22px', // Increased padding for a substantial feel
    fontSize: '18px',
    borderRadius: '15px', // More rounded
    border: '1px solid #d0d0d0', // Very subtle border
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    width: 'calc(100% - 40px)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
    width: 'calc(100% - 44px)', // Adjust width for padding
    boxSizing: 'border-box',
    backgroundColor: '#fdfdfd', // Very subtle off-white background for inputs
  },
  button: {
    marginTop: '25px',
    padding: '16px 30px',
    fontSize: '18px',
    background: 'linear-gradient(135deg, #CD5C5C 0%, #FF6347 100%)',
    marginTop: '30px', // More space above button
    padding: '18px 35px', // Larger button
    fontSize: '19px', // Larger font
    background: PRIMARY_BUTTON_GRADIENT, // Custom gradient
    color: 'white',
    border: 'none',
    borderRadius: '35px',
    borderRadius: '40px', // Very pill-shaped
    cursor: 'pointer',
    fontWeight: '700',
    letterSpacing: '0.8px',
    boxShadow: '0 6px 20px rgba(205, 92, 92, 0.4)',
    letterSpacing: '1px',
    boxShadow: '0 8px 25px rgba(205, 92, 92, 0.4)', // Initial shadow
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupText: {
    textAlign: 'center',
    fontSize: '15px',
    fontSize: '16px',
    color: '#666',
    marginTop: '18px',
    marginTop: '22px',
  },
  signupLink: {
    color: '#8B4513',
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'color 0.3s ease, text-decoration 0.3s ease',
  },
};
