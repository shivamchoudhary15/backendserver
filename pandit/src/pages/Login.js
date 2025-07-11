import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import { motion } from 'framer-motion';
import './Login.css'; // Assuming Login.css is in the same folder

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
      {/* Background image on left side */}
      <div
        className="login-left"
        style={{
          backgroundImage: "url('/images/download.jpeg')", // ✅ From public/images
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Login form */}
      <div className="login-right">
        <motion.div
          className="login-form-box"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="/images/subh.png" // ✅ Logo from public/images
            alt="Logo"
            className="login-logo"
          />
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

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-link">
            <p>
              Don’t have an account?{' '}
              <Link to="/signup">Join as Devotee</Link>
            </p>
            <p style={{ marginTop: '10px' }}>
              Are you a Pandit?{' '}
              <Link to="/signup/pandit">Register as Pandit</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
