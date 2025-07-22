import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // <--- add this!
import './Login.css';

const GOOGLE_CLIENT_ID = '285160037801-8je1h2pconfermojci9vesa8v2len5ol.apps.googleusercontent.com';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const navigate = useNavigate();
  const googleBtnRef = useRef();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Your original backend login can remain here if you want.
      // Otherwise, just remove this block for Google-only demo.
      setError('This login does not work in frontend-only mode.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In handler: frontend-only, decode token directly!
  const handleGoogleResponse = (response) => {
    try {
      const userProfile = jwt_decode(response.credential);
      // Now userProfile contains {name, email, picture, ...}
      setGoogleUser(userProfile);
      localStorage.setItem('googleUser', JSON.stringify(userProfile));
      alert('✅ Google Sign-In success!\n' + userProfile.email);
      // Navigate to dashboard or wherever:
      navigate('/dashboard');
    } catch (err) {
      setError('❌ Google login failed (frontend-only).');
    }
  };

  useEffect(() => {
    if (window.google && googleBtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        width: "100%",
      });
    }
  }, [googleBtnRef.current]);

  return (
    <div className="pandit-login-bg">
      <div className="pandit-login-container">
        {/* Left side */}
        <div
          className="pandit-login-left"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgba(250,140,52,0.3), rgba(146,53,53,0.25)), url('/images/i3.jpeg')`,
          }}
        >
          <div className="pandit-login-overlay">
            <img
              src="/images/i1.jpeg"
              alt="Friendly Pandit Mascot"
              className="pandit-mascot-img"
              style={{
                width: 120,
                borderRadius: '50%',
                marginBottom: 18,
                boxShadow: '0 2px 12px #a97f55'
              }}
            />
            <h2>Experience Sacred Service</h2>
            <p>
              Book trusted pandits & pooja experts for every occasion,<br />
              anytime, anywhere in India.
            </p>
            <ul className="pandit-login-usp">
              <li>🕉️ 100% Verified Pandits</li>
              <li>🌺 Multiple Language Options</li>
              <li>🏠 Home & Online Puja Services</li>
            </ul>
          </div>
        </div>

        {/* Right side login form */}
        <div className="pandit-login-right">
          <div className="pandit-login-card">
            <img
              src="/images/subh.png"
              alt="Pandit Booking Logo"
              className="pandit-login-logo"
            />
            <div className="pandit-login-tagline">Your Path to Sacred Beginnings</div>
            <h3 className="pandit-login-welcome">Welcome Back</h3>

            {/* GOOGLE SIGN-IN BUTTON */}
            <div ref={googleBtnRef} style={{ width: "100%", marginBottom: 10 }}></div>
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

            {/* Show frontend Google sign-in user info if available */}
            {googleUser && (
              <div style={{ marginTop: 18, textAlign: "center" }}>
                <img src={googleUser.picture} alt="profile" style={{ borderRadius: "50%", width: 48, marginBottom: 8 }}/>
                <div>Signed in as <b>{googleUser.name}</b><br/>{googleUser.email}</div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
