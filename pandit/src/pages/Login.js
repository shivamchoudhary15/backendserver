import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';

const BACKGROUND_IMAGE = '/images/background.jpg'; // Left side image (spiritual themed)
const LOGO_IMAGE = '/images/subh.png'; // Circular logo

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
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* Left Side */}
        <div style={styles.left}>
          <img src={BACKGROUND_IMAGE} alt="Spiritual" style={styles.image} />
        </div>

        {/* Right Side */}
        <motion.div
          style={styles.right}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <div style={styles.card}>
            <img src={LOGO_IMAGE} alt="Logo" style={styles.logo} />
            <h2 style={styles.title}>Welcome Back!</h2>
            <p style={styles.subtitle}>Your Path to Sacred Beginnings</p>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
                style={styles.input}
              />

              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
                style={styles.input}
              />

              <motion.button
                type="submit"
                style={styles.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>
            </form>

            <p style={styles.bottomText}>
              Don’t have an account?{' '}
              <Link to="/signup" style={styles.link}>Join as Devotee</Link>
            </p>
            <p style={styles.bottomText}>
              Are you a Pandit?{' '}
              <Link to="/signup/pandit" style={styles.link}>Register as Pandit</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

// CSS-in-JS styles
const styles = {
  wrapper: {
    width: '100vw',
    height: '100vh',
    background: '#f6efe7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: '1100px',
    height: '90%',
    display: 'flex',
    boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
    borderRadius: '15px',
    overflow: 'hidden',
    background: '#fff',
  },
  left: {
    flex: 1,
    background: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  right: {
    flex: 1,
    backgroundColor: '#fff8f0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  logo: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #FFD700',
    marginBottom: '10px',
  },
  title: {
    margin: '10px 0 5px',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: '14px',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  label: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#8B0000',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
  button: {
    padding: '12px',
    background: 'linear-gradient(to right, #e94e77, #f2709c)',
    border: 'none',
    borderRadius: '25px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#d8000c',
    padding: '10px',
    borderRadius: '8px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  bottomText: {
    fontSize: '14px',
    color: '#333',
    marginTop: '10px',
  },
  link: {
    color: '#8B0000',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};
