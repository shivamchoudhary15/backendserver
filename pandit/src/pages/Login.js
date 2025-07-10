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
    <div style={styles.page}>
      <div style={styles.overlay}>
        <motion.div
          style={styles.formContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
              Don’t have an account? <Link to="/signup" style={styles.link}>Join as Devotee</Link>
            </p>
            <p style={{ ...styles.text, marginTop: '8px' }}>
              Are you a Pandit? <Link to="/signup/pandit" style={styles.link}>Register as Pandit</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

const styles = {
  page: {
    backgroundImage: `url(${BACKGROUND_IMAGE})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: '100%',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255, 0)', // fully transparent, image shows fully
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    textAlign: 'center',
    color: '#222',
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
  },
  logo: {
    width: '130px',
    height: '130px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #FFD700',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '16px',
    fontStyle: 'italic',
    color: '#333',
    marginBottom: '25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    fontWeight: 'bold',
    color: '#8B0000',
    marginBottom: '5px',
    fontSize: '15px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(to right, #d2691e, #ff9933)',
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
  },
  text: {
    fontSize: '14px',
    color: '#222',
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
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
  },
};
