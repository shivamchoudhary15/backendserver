// src/pages/Signup.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/api';
import './Signup.css';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    address: ''
  });

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={nextStep} className="primary-btn">Next</button>
          </>
        );
      case 2:
        return (
          <>
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password (8 characters)"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={8}
            />
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">Back</button>
              <button type="button" onClick={nextStep} className="primary-btn">Next</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
            <input
              name="address"
              placeholder="Complete Address"
              value={form.address}
              onChange={handleChange}
            />
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">Back</button>
              <button type="submit" className="primary-btn">Register</button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const backgroundStyle = {
    minHeight: '100vh',
    backgroundImage: `url('/images/b2.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px'
  };

  return (
    <div style={backgroundStyle}>
      <form onSubmit={handleSubmit} className="glass-form">
        <h2>Create Your Account</h2>
        <p className="step-indicator">Step {step} of 3</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="animated-step"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </form>
    </div>
  );
}
