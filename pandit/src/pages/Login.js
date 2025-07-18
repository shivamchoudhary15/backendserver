// src/pages/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../pages/Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // login logic
    console.log('Login submitted:', { email, password });
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="image-overlay"></div>
        <img src="/images/ho1.jpg" alt="Background" className="background-image" />
      </div>
      <div className="login-right">
        <div className="login-box">
          <img src="/images/subh.png" alt="Logo" className="login-logo" />
          <h2>Welcome Back</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
            </div>
            <button type="submit" className="login-button">
              Login
            </button>
            <div className="login-links">
              <Link to="/signup">Join as Devotee</Link>
              <span> | </span>
              <Link to="/signup/pandit">Register as Pandit</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
