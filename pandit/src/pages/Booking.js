import React, { useState, useEffect } from 'react';
import {
  createBooking,
  getVerifiedPandits,
  getPoojas,
  getServices
} from '../api/api';
import './Booking.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const stepTitles = [
  "Choose Service & Pandit",
  "Select Date & Location",
  "Review & Book"
];

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
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [step, setStep] = useState(1);
  const [filteredPandits, setFilteredPandits] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userid = user?._id;
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [pdRes, pjRes, srvRes] = await Promise.all([
          getVerifiedPandits(),
          getPoojas(),
          getServices()
        ]);
        const verifiedPandits = pdRes.data?.filter(p => p.is_verified) || [];
        setPandits(verifiedPandits);
        setFilteredPandits(verifiedPandits);
        setPoojas(pjRes.data || []);
        setServices(srvRes.data || []);
      } catch {
        alert('Failed to load data. Please try again later.');
      }
    }
    if (userid) load();
  }, [userid]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPandits(pandits);
    } else {
      setFilteredPandits(
        pandits.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, pandits]);

  const selectedServiceName = services.find(s => s._id === details.serviceid)?.name;
  const filteredPoojas = selectedServiceName === 'Astrological Service'
    ? astrologicalPoojas
    : poojas;

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, stepTitles.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { serviceid, panditid, poojaId, puja_date, puja_time, location } = details;
    if (!serviceid || !panditid || !poojaId || !puja_date || !puja_time || !location) {
      alert('Please fill all fields');
      return;
    }
    try {
      await createBooking({ ...details, userid });
      alert('✅ Booking created!');
      navigate('/dashboard');
    } catch (error) {
      alert(error?.response?.data?.message || '❌ Booking could not be completed.');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              type="text"
              placeholder="Search Pandit"
              className="signup-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              name="serviceid"
              className="signup-input"
              onChange={handleChange}
              value={details.serviceid || ''}
              required
            >
              <option value="">-- Select Service --</option>
              {services.length ? (
                services.map(service => (
                  <option key={service._id} value={service._id}>{service.name}</option>
                ))
              ) : (
                <option disabled>Loading services...</option>
              )}
            </select>

            <div className="pandit-row">
              {filteredPandits.length ? filteredPandits.map(p => (
                <div
                  key={p._id}
                  className={`pandit-card${details.panditid === p._id ? ' selected' : ''}`}
                  onClick={() => setDetails({ ...details, panditid: p._id })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if(e.key==='Enter') setDetails({ ...details, panditid: p._id }); }}
                >
                  <div className="pandit-avatar">{p.name.charAt(0).toUpperCase()}</div>
                  <div className="pandit-name">{p.name}</div>
                  <div className="pandit-rating">
                    <span>⭐</span> {p.rating?.toFixed(1) ?? '4.2'}
                    <span style={{ marginLeft: 4, color: '#7D8CA3' }}>
                      ({p.reviewsCount || '41'})
                    </span>
                  </div>
                  <div className="pandit-badge">Verified</div>
                </div>
              )) : (
                <div style={{ color: '#bcbfcf', padding: '18px 0', width: '100%', textAlign: 'center' }}>
                  No verified pandits available.
                </div>
              )}
            </div>

            <select
              name="poojaId"
              className="signup-input"
              onChange={handleChange}
              value={details.poojaId || ''}
              required
            >
              <option value="">-- Select Pooja --</option>
              {filteredPoojas.length ? (
                filteredPoojas.map(pooja => (
                  <option key={pooja._id} value={pooja._id}>{pooja.name}</option>
                ))
              ) : (
                <option disabled>No poojas found</option>
              )}
            </select>
            
            <button
              type="button"
              className="primary-btn"
              onClick={nextStep}
            >
              Continue
            </button>
          </>
        );

      case 2:
        return (
          <>
            <input
              type="date"
              name="puja_date"
              className="signup-input"
              value={details.puja_date || ''}
              onChange={handleChange}
              required
            />
            <input
              type="time"
              name="puja_time"
              className="signup-input"
              value={details.puja_time || ''}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              className="signup-input"
              placeholder="Location"
              value={details.location || ''}
              onChange={handleChange}
              required
            />
            <div className="step-buttons">
              <button
                type="button"
                className="secondary-btn"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </>
        );

      case 3:
        const selectedPandit = pandits.find(p => p._id === details.panditid);
        const selectedPooja = (selectedServiceName === 'Astrological Service'
          ? astrologicalPoojas.find(pj => pj._id === details.poojaId)
          : poojas.find(pj => pj._id === details.poojaId)) || {};
        return (
          <>
            <h3 className="review-title">Review your booking</h3>
            <ul className="review-list" aria-live="polite">
              <li><strong>Service:</strong> {selectedServiceName || '—'}</li>
              <li><strong>Pandit:</strong> {selectedPandit?.name || '—'}</li>
              <li><strong>Pooja:</strong> {selectedPooja?.name || '—'}</li>
              <li><strong>Date:</strong> {details.puja_date || '—'}</li>
              <li><strong>Time:</strong> {details.puja_time || '—'}</li>
              <li><strong>Location:</strong> {details.location || '—'}</li>
            </ul>
            <div className="step-buttons">
              <button
                type="button"
                className="secondary-btn"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                type="submit"
                className="primary-btn"
              >
                Book Now
              </button>
            </div>
          </>
        );

      default: 
        return null;
    }
  };

  return (
    <div className="booking-bg" role="main" aria-label="Pandit booking form">
      <motion.form
        className="glass-form-pro"
        onSubmit={handleSubmit}
        initial={{ scale: 0.98, opacity: 0, y: 38 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut'}}
        noValidate
      >
        <motion.h2
          className="booking-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.13 }}
        >
          Sacred Ceremony Booking
        </motion.h2>
        <nav aria-label="Booking steps" className="steps-nav only-box">
          {stepTitles.map((title, idx) => (
            <motion.div
              key={title}
              className={`steps-circle onlybox ${step === idx+1 ? 'active' : ''}`}
              aria-current={step === idx + 1 ? 'step' : undefined}
              aria-label={`Step ${idx + 1}: ${title}`}
              animate={{ scale: step === idx+1 ? 1.07 : 1 }}
              transition={{ type: "spring", stiffness: 220 }}
            >
              <span className="step-label step-label-box">{title}</span>
            </motion.div>
          ))}
        </nav>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.45, ease: 'anticipate' }}
            className="animated-step"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </motion.form>
    </div>
  );
}

export default Booking;
