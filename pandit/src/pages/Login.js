import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';

const BACKGROUND_IMAGE = '/images/background.jpg';
const LOGO_IMAGE = '/images/subh.png';

const Login = () => {
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
        setError('Invalid login. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Side: Spiritual Image */}
      <div style={styles.left}>
        <img src={BACKGROUND_IMAGE} alt="Spiritual" style={styles.bgImage} />
      </div>

      {/* Right Side: Login Form */}
      <div style={styles.right}>
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <img src={LOGO_IMAGE} alt="Logo" style={styles.logo} />
          <p style={styles.subtitle}>Your Path to Sacred Beginnings</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="example@gmail.com"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="********"
              />
            </div>

            <motion.button
              type="submit"
              style={styles.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>

            <p style={styles.text}>
              Don’t have an account?{' '}
              <Link to="/signup" style={styles.link}>Join as Devotee</Link>
            </p>
            <p style={styles.text}>
              Are you a Pandit?{' '}
              <Link to="/signup/pandit" style={styles.link}>Register as Pandit</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    fontFamily: 'Segoe UI, sans-serif',
  },
  left: {
    flex: 1,
    overflow: 'hidden',
  },
  right: {
    flex: 1,
    background: '#f9f5f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.92)', // Semi-transparent white
    borderRadius: '20px',
    border: '3px solid #d2691e',
    padding: '40px',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    textAlign: 'center',
    backdropFilter: 'blur(4px)',
  },
  logo: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #FFD700',
    marginBottom: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '16px',
    color: '#333',
    fontStyle: 'italic',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  label: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#8B0000',
    marginBottom: '5px',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%',
    outline: 'none',
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(to right, #e94e77, #f2709c)',
    border: 'none',
    borderRadius: '30px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  text: {
    fontSize: '14px',
    color: '#333',
  },
  link: {
    color: '#8B0000',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#d8000c',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
};
