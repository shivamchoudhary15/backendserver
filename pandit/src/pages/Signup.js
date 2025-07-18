// src/pages/Signup.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('devotee');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep(2);
        alert('OTP sent to your email');
      } else {
        alert(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending OTP');
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();

    try {
      // Secure OTP verification
      const otpRes = await fetch('/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        alert(otpData.error || 'Invalid or expired OTP');
        return;
      }

      // Proceed to register user
      const endpoint = role === 'pandit' ? '/api/pandits/add' : '/api/users/add';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Signup successful!');
        navigate('/login');
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error(err);
      alert('Signup error occurred');
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <img src="/images/signup-bg.jpg" alt="Spiritual" className="signup-bg-image" />
      </div>

      <div className="signup-right">
        <div className="signup-form-container">
          <img src="/images/subh.png" alt="Logo" className="signup-logo" />
          <h2 className="signup-title">Join Shubkarya</h2>

          <div className="role-selector">
            <button
              className={role === 'devotee' ? 'active' : ''}
              onClick={() => setRole('devotee')}
            >
              Join as Devotee
            </button>
            <button
              className={role === 'pandit' ? 'active' : ''}
              onClick={() => setRole('pandit')}
            >
              Register as Pandit
            </button>
          </div>

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <input type="text" name="phone" placeholder="Phone" required onChange={handleChange} />
              <input type="text" name="city" placeholder="City" required onChange={handleChange} />
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </div>
              <button type="submit" className="submit-btn">Send OTP</button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerify}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="submit-btn">Verify & Register</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Signup;
