// src/pages/Signup.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/api';
import backgroundImage from '../images/signup-bg.jpg'; // Import the background image

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    address: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert('Signup successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || 'Signup failed');
    }
  };

  // Styles
  const pageStyle = {
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '20px',
  };

  const formContainer = {
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    padding: '40px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(3px)',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '28px',
    color: '#b1450c',
    marginBottom: '25px',
    fontWeight: '700',
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#333',
  };

  const inputStyle = {
    padding: '10px 12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
    transition: 'border 0.3s, box-shadow 0.3s',
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '12px',
    fontSize: '18px',
    backgroundColor: '#d35400',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: '#a33c00',
  };

  return (
    <div style={pageStyle}>
      <div style={formContainer}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <h2 style={headingStyle}>📝 Create Your Account</h2>

          <label style={labelStyle}>Name</label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Email</label>
          <input
            name="email"
            placeholder="Enter your email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Phone</label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>City (optional)</label>
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            style={inputStyle}
          />

          <label style={labelStyle}>Address (optional)</label>
          <input
            name="address"
            placeholder="Complete address"
            value={form.address}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#a33c00')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#d35400')}
          >
            🚀 Signup
          </button>
        </form>
      </div>
    </div>
  );
}
