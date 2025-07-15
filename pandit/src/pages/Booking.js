// src/pages/Booking.js
import React, { useState, useEffect } from 'react';
import {
  createBooking,
  getVerifiedPandits,
  getPoojas,
  getServices,
  getBookings,
  createReview
} from '../api/api';
import './Booking.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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
  const [bookings, setBookings] = useState([]);
  const [review, setReview] = useState({ rating: '', comment: '' });
  const [search, setSearch] = useState('');
  const [step, setStep] = useState(1);
  const [filteredPandits, setFilteredPandits] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const userid = user?._id;
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const [pdRes, pjRes, srvRes, bookingsRes] = await Promise.all([
          getVerifiedPandits(),
          getPoojas(),
          getServices(),
          getBookings({ userid })
        ]);
        const verifiedPandits = pdRes.data.filter(p => p.is_verified);
        setPandits(verifiedPandits);
        setFilteredPandits(verifiedPandits);
        setPoojas(pjRes.data || []);
        setServices(srvRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    if (userid) load();
  }, [userid]);

  useEffect(() => {
    setFilteredPandits(
      pandits.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, pandits]);

  const selectedServiceName = services.find(s => s._id === details.serviceid)?.name;
  const filteredPoojas =
    selectedServiceName === 'Astrological Service'
      ? astrologicalPoojas
      : poojas;

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleReviewChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = async (bookingId) => {
    if (!review.rating || !review.comment) return alert('Fill all review fields');
    await createReview({ ...review, bookingId, name: user.name });
    alert('✅ Review submitted');
    setReview({ rating: '', comment: '' });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { serviceid, panditid, poojaId, puja_date, puja_time, location } = details;
    if (!serviceid || !panditid || !poojaId || !puja_date || !puja_time || !location) {
      alert('Please fill all fields');
      return;
    }

    await createBooking({ ...details, userid });
    alert('✅ Booking created!');
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input
              type="text"
              placeholder="Search Pandit"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="signup-input"
            />

            <select
              name="serviceid"
              onChange={handleChange}
              required
              className="signup-input"
            >
              <option value="">-- Select Service --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>

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
              <li>Service: {selectedServiceName}</li>
              <li>Pandit: {pandits.find(p => p._id === details.panditid)?.name}</li>
              <li>Pooja: {(selectedServiceName === 'Astrological Service'
                ? astrologicalPoojas.find(pj => pj._id === details.poojaId)
                : poojas.find(pj => pj._id === details.poojaId))?.name}</li>
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

      {/* My Bookings Section */}
      <div className="booking-history">
        <h2>My Bookings</h2>
        {bookings.length === 0 ? <p>No bookings found.</p> : (
          bookings.map(b => (
            <div key={b._id} className="booking-item">
              <p><strong>Pooja:</strong> {b.poojaId?.name || b.poojaId}</p>
              <p><strong>Pandit:</strong> {b.panditid?.name || b.panditid}</p>
              <p><strong>Date:</strong> {b.puja_date?.slice(0, 10)}</p>
              <p><strong>Time:</strong> {b.puja_time}</p>
              <p><strong>Status:</strong> {b.status}</p>

              <div className="review-form">
                <input type="number" name="rating" value={review.rating} onChange={handleReviewChange} placeholder="Rating (1-5)" />
                <textarea name="comment" value={review.comment} onChange={handleReviewChange} placeholder="Write your review..." />
                <button onClick={() => handleReviewSubmit(b._id)}>Submit Review</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Booking;
