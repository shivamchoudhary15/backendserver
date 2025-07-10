import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';
import '../styles/Login.css'; // make sure this path is correct

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
    <div className="login-container">
      <div className="login-left"></div>

      <div className="login-right">
        <motion.div
          className="login-form-box"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>

            <div className="login-link">
              Don’t have an account? <Link to="/signup">Join as Devotee</Link>
            </div>
            <div className="login-link">
              Are you a Pandit? <Link to="/signup/pandit">Register as Pandit</Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
