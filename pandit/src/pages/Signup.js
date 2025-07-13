// src/pages/Signup.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/api';
import './Signup.css'; // Link to the updated CSS with animation

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

  return (
    <div
      className="signup-page animated-bg"
      style={{
        backgroundImage: `url('/images/signup-bg.jpg')`,
      }}
    >
      <div className="signup-container fade-in">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="signup-heading">📝 Create Your Account</h2>

          <label className="signup-label">Name</label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
            className="signup-input"
          />

          <label className="signup-label">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="signup-input"
          />

          <label className="signup-label">Phone</label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
            required
            className="signup-input"
          />

          <label className="signup-label">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
            className="signup-input"
          />

          <label className="signup-label">City (optional)</label>
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="signup-input"
          />

          <label className="signup-label">Address (optional)</label>
          <input
            name="address"
            placeholder="Complete address"
            value={form.address}
            onChange={handleChange}
            className="signup-input"
          />

          <button type="submit" className="signup-button">
            🚀 Signup
          </button>
        </form>
      </div>
    </div>
  );
}
