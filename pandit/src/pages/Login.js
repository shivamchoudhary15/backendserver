import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { login } from '../api/api';
import './Login.css';
import logo from '../images/subh.png';
import background from '../images/background.jpg'; // Adjust based on your file path

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      setError('❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-full-bg" style={{ backgroundImage: `url(${background})` }}>
      <motion.div
        className="login-box"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src={logo} alt="Logo" className="login-logo" />
        <p className="login-tagline">Your Path to Sacred Beginnings</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            required
          />
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              required
            />
            <span className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="login-link">
          Don’t have an account? <Link to="/signup">Join as Devotee</Link>
        </p>
        <p className="login-link">
          Are you a Pandit? <Link to="/signup/pandit">Register as Pandit</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
