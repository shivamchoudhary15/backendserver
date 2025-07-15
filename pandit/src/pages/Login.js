import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Login.css';

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
      const response = await axios.post('https://backendserver-pf4h.onrender.com/api/users/login', form);
      const { token, user } = response.data;

      if (token && user?._id) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        alert('✅ Login successful!');

        // Redirect based on actual user.role
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'pandit') {
          navigate('/pandit-dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid login. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div
        className="login-left"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(91, 58, 41, 0.9), rgba(91, 58, 41, 0.6)), url('/images/download.jpeg')`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#5b3a29',
        }}
      />

      <div className="login-right">
        <motion.div
          className="login-form-box"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src="/images/subh.png" alt="Logo" className="login-logo" />
          <p className="login-tagline">Your Path to Sacred Beginnings</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}

            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@gmail.com"
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="********"
            />

            <motion.button
              type="submit"
              className="login-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <div className="login-link">
            <p>Don’t have an account? <Link to="/signup">Join as Devotee</Link></p>
            <p>Are you a Pandit? <Link to="/signup/pandit">Register as Pandit</Link></p>
            //<p><strong>Admin?</strong> <Link to="/admin-login">Login as Admin</Link></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
