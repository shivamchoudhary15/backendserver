import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    city: '',
    phone: '',
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!otpVerified) {
      alert('Please verify OTP before registering.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://backendserver-pf4h.onrender.com/api/users/view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong during signup.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    try {
      const res = await fetch('https://backendserver-pf4h.onrender.com/api/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('OTP sent to your email.');
        setOtpSent(true);
      } else {
        alert(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      alert('Error sending OTP');
      console.error(err);
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await fetch('https://backendserver-pf4h.onrender.com/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpVerified(true);
        setOtpError('');
        alert('OTP verified!');
      } else {
        setOtpError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setOtpError('Verification failed.');
      console.error(err);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
              />
            </div>
            <motion.button type="button" onClick={() => setStep(2)} className="next-btn" whileTap={{ scale: 0.97 }}>
              Next
            </motion.button>
          </>
        );
      case 2:
        return (
          <>
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            {!otpSent ? (
              <motion.button type="button" onClick={sendOtp} className="otp-btn" whileTap={{ scale: 0.97 }}>
                Send OTP
              </motion.button>
            ) : (
              <>
                <div className="input-group">
                  <input
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  {otpError && <span className="signup-error">{otpError}</span>}
                </div>
                {!otpVerified && (
                  <motion.button type="button" onClick={verifyOtp} className="otp-btn" whileTap={{ scale: 0.97 }}>
                    Verify OTP
                  </motion.button>
                )}
                {otpVerified && <span className="otp-success">✅ OTP Verified</span>}
              </>
            )}

            <div className="input-group">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
            <motion.button type="button" onClick={() => setStep(3)} className="next-btn" whileTap={{ scale: 0.97 }}>
              Next
            </motion.button>
          </>
        );
      case 3:
        return (
          <>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <motion.button
              type="submit"
              className="submit-btn"
              whileTap={{ scale: 0.97 }}
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </motion.button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Signup</h2>
        {renderStep()}
      </form>
    </div>
  );
};

export default Signup;
