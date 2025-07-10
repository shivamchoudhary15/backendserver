import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';

// No spiritual background image for this design, using a subtle pattern background.
// We'll define the pattern in the styles below.

// --- YOUR SHUBHKARYA LOGO/IMAGE PATH ---
// Make sure you have placed your image file (e.g., 'shubhkarya-logo.png')
// inside your 'public/images/' folder.
const SHUBHKARYA_LOGO_PATH = '/images/logo_shubh.png'; // <--- UPDATE THIS PATH TO YOUR IMAGE FILE

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

  // Framer Motion Variants - adapted for this new design
  const pageWrapperVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const formContainerVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
        delay: 0.2, // Form appears after background
      },
    },
  };

  const formItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      boxShadow: '0px 6px 15px rgba(52, 152, 219, 0.4)', // Blue shadow
      transition: { duration: 0.15 }
    },
    tap: { scale: 0.98 },
  };

  const inputFocus = {
    borderColor: '#3498db', // Blue border on focus
    borderBottomWidth: '2px', // Thicker bottom border on focus
    boxShadow: 'none', // No glow shadow like previous design
  };

  return (
    <motion.div
      style={styles.pageWrapper}
      variants={pageWrapperVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        style={styles.container}
        variants={formContainerVariants}
      >
        <div style={styles.formHeader}>
          {/* Replaced Font Awesome icon with your custom image */}
          <img src={SHUBHKARYA_LOGO_PATH} alt="ShubhKarya Logo" style={styles.shubhKaryaLogo} />
          <h2 style={styles.formHeaderTitle}>Login to ShubhKarya</h2> {/* Updated title */}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          style={styles.form}
          variants={formItemVariants}
          initial="hidden"
          animate="visible"
        >
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
            <i className="fas fa-envelope" style={styles.inputIcon}></i>
            <motion.input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
              whileFocus={inputFocus}
            />
          </div>

          <div style={styles.inputGroup}>
            <i className="fas fa-lock" style={styles.inputIcon}></i>
            <motion.input
              name="password"
              type="password"
              placeholder="Password"
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

          <div style={styles.linksContainer}>
                <Link to="/forgot-password" style={styles.textLink}>Forgot Password?</Link>
                <Link to="/signup" style={styles.textLink}>Join as Devotee</Link>
                <Link to="/signup/pandit" style={styles.textLink}>Register as Pandit</Link>
           </div>

        </motion.form>
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
    backgroundColor: '#ecf0f1',
    backgroundImage: 'linear-gradient(45deg, #f0f3f4 25%, transparent 25%, transparent 75%, #f0f3f4 75%, #f0f3f4), linear-gradient(45deg, #f0f3f4 25%, transparent 25%, transparent 75%, #f0f3f4 75%, #f0f3f4)',
    backgroundSize: '20px 20px',
    backgroundPosition: '0 0, 10px 10px',
    fontFamily: "'Roboto', sans-serif",
    color: '#333',
    overflow: 'hidden',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
    width: '90%',
    maxWidth: '400px',
    overflow: 'hidden',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
  },
  formHeader: {
    backgroundColor: '#3498db',
    padding: '25px 0',
    textAlign: 'center',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  // New style for your ShubhKarya logo/image
  shubhKaryaLogo: {
    width: '80px', // Adjust size as needed
    height: 'auto',
    marginBottom: '10px',
    borderRadius: '50%', // If you want a circular logo
    border: '2px solid rgba(255,255,255,0.8)', // Subtle white border
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)', // Small shadow for depth
  },
  formHeaderTitle: {
    fontSize: '28px',
    fontWeight: 'normal',
    margin: 0,
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
  },
  form: {
    padding: '0 30px 30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  errorMessage: {
    color: '#dc3545',
    backgroundColor: '#ffe6e6',
    border: '1px solid #dc3545',
    padding: '10px 15px',
    borderRadius: '5px',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '10px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  inputGroup: {
    position: 'relative',
    marginBottom: '10px',
  },
  inputIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#95a5a6',
    fontSize: '18px',
  },
  input: {
    width: 'calc(100% - 60px)',
    padding: '15px 15px 15px 50px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#f8f9fa',
  },
  button: {
    marginTop: '10px',
    padding: '15px 20px',
    fontSize: '18px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '600',
    letterSpacing: '0.5px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
    transition: 'background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  textLink: {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.2s ease',
  },
};
