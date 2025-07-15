// src/pages/Booking.js
import React, { useState, useEffect } from 'react';
import { createBooking, getVerifiedPandits, getPoojas } from '../api/api';
import './Booking.css';
import { motion, AnimatePresence } from 'framer-motion';

const astrologicalPoojas = [
  { _id: 'kundli', name: 'Kundli Analysis' },
  { _id: 'horoscope', name: 'Horoscope Matching' },
  { _id: 'career', name: 'Career and Business Guidance' },
  { _id: 'health', name: 'Health Analysis' }
];

function Booking() {
  const [details, setDetails] = useState({});
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [search, setSearch] = useState('');
  const [step, setStep] = useState(1);
  const user = JSON.parse(localStorage.getItem('user'));
  const userid = user?._id;

  useEffect(() => {
    async function load() {
      try {
        const [pdRes, pjRes] = await Promise.all([
          getVerifiedPandits(),
          getPoojas(),
        ]);
        setPandits(pdRes.data.filter(p => p.is_verified));
        setPoojas(pjRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    load();
  }, []);

  const filteredPandits = pandits.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPoojas = poojas.filter((pj) =>
    pj.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { panditid, poojaId, puja_date, puja_time, location } = details;
    if (!panditid || !poojaId || !puja_date || !puja_time || !location) {
      alert('Please fill all fields');
      return;
    }

    await createBooking({ ...details, userid });
    alert('✅ Booking created!');
    setStep(1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              type="text"
              placeholder="Search Pandit or Pooja"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="signup-input"
            />

            <select name="panditid" onChange={handleChange} required className="signup-input">
              <option value="">-- Pandit --</option>
              {filteredPandits.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>

            <select name="poojaId" onChange={handleChange} required className="signup-input">
              <option value="">-- Pooja --</option>
              {filteredPoojas.map((pj) => (
                <option key={pj._id} value={pj._id}>{pj.name}</option>
              ))}
            </select>

            <button type="button" onClick={nextStep} className="primary-btn">Next</button>
          </>
        );

      case 2:
        return (
          <>
            <input
              type="date"
              name="puja_date"
              onChange={handleChange}
              required
              className="signup-input"
            />
            <input
              type="time"
              name="puja_time"
              onChange={handleChange}
              required
              className="signup-input"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              onChange={handleChange}
              required
              className="signup-input"
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
            <h3 style={{ color: 'white' }}>Review your details</h3>
            <ul className="review-list">
              <li>Pandit: {pandits.find(p => p._id === details.panditid)?.name}</li>
              <li>Pooja: {poojas.find(pj => pj._id === details.poojaId)?.name}</li>
              <li>Date: {details.puja_date}</li>
              <li>Time: {details.puja_time}</li>
              <li>Location: {details.location}</li>
            </ul>
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">Back</button>
              <button type="submit" className="primary-btn">Book Now</button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="booking-page" style={{ backgroundImage: `url('/images/b2.jpg')` }}>
      <form className="glass-form" onSubmit={handleSubmit}>
        <h2 style={{ color: 'white' }}>Book Pandit Ji for Your Puja</h2>
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

export default Booking;
