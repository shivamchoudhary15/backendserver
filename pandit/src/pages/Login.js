import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/api';
import './Login.css'; // 👈 Import CSS

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
      {/* Left: Background Image */}
      <div className="login-left" />

      {/* Right: Login Form */}
      <div className="login-right">
        <div className="login-form-box">
          <img src="/images/logo.png" alt="Logo" className="login-logo" />
          <p className="login-tagline">Your Path to Sacred Beginnings</p>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}
            <div>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="********"
              />
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
