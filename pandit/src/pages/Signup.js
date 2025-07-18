import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
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
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'pandit') navigate('/pandit-dashboard');
        else navigate('/dashboard');
      } else {
        setError('Invalid login. Try again.');
      }
    } catch (err) {
      setError(err.response?.data?.error || '❌ Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pandit-login-bg">
      <div className="pandit-login-container">
        {/* Left Side */}
        <div
          className="pandit-login-left"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(250,140,52,0.35), rgba(146,53,53,0.17)), url('/images/i4.jpeg')`,
          }}
        >
          <div className="pandit-login-overlay">
            <img
              src="/images/i5.jpeg"
              alt="Friendly Pandit Mascot"
              className="pandit-mascot-img"
              style={{
                width: 118,
                borderRadius: '60%',
                marginBottom: 18,
                boxShadow: '0 2px 12px #a97f55',
                background: "#fffef8"
              }}
            />
            <h2>Experience Sacred Service</h2>
            <p>
              Book trusted pandits &amp; pooja experts for every occasion,<br />
              anytime, anywhere in India.
            </p>
            <ul className="pandit-login-usp">
              <li>🕉️ 100% Verified Pandits</li>
              <li>🌺 Multiple Language Options</li>
              <li>🏠 Home &amp; Online Puja Services</li>
            </ul>
          </div>
        </div>
        {/* Right Side */}
        <div className="pandit-login-right">
          <div className="pandit-login-card">
            <img
              src="/images/subh.png"
              alt="Pandit Booking Logo"
              className="pandit-login-logo"
            />
            <div className="pandit-login-tagline">Your Path to Sacred Beginnings</div>
            <h3 className="pandit-login-welcome">Welcome Back</h3>
            <button className="pandit-google-btn" disabled>
              <span className="google-icon">🔵</span> Sign in with Google
            </button>
            <div className="pandit-or-divider">or</div>
            <form onSubmit={handleSubmit} className="pandit-login-form" autoComplete="on">
              {error && <div className="pandit-login-error">{error}</div>}
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
                autoComplete="username"
              />
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
                minLength={6}
                autoComplete="current-password"
              />
              <button type="submit" className="pandit-login-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div className="pandit-login-link">
              <span>
                Don’t have an account? <Link to="/signup">Join as Devotee</Link>
              </span>
              <span>
                Are you a Pandit? <Link to="/signup/pandit">Register as Pandit</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
