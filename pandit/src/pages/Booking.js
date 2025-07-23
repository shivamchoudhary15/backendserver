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
import {
  User,
  Calendar,
  MapPin,
  ChevronRight,
  CheckCircle,
  Search,
  Book,
  Sun,
  Clock   // <-- Added Clock import here
} from 'lucide-react';

const bgImage = "/images/sat.jpeg";

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
      } catch (err) {
        alert('Failed to load data. Try again later.');
      }
    }
    if (userid) load();
  }, [userid]);

  useEffect(() => {
    setFilteredPandits(
      pandits.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, pandits]);

  const selectedServiceName = services.find(s => s._id === details.serviceid)?.name;
  const filteredPoojas = selectedServiceName === 'Astrological Service'
    ? astrologicalPoojas
    : poojas;

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
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
    try {
      await createBooking({ ...details, userid });
      alert('✅ Booking created!');
      navigate('/dashboard');
    } catch (error) {
      alert(error?.response?.data?.message || '❌ Booking not available for this Pandit on the selected date.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div style={{ position: 'relative' }}>
              <Search className="lucide-icon" style={{ position: 'absolute', left: 8, top: 12, opacity: 0.66 }} size={18} />
              <input
                type="text"
                placeholder="Search Pandit"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="signup-input"
                style={{ paddingLeft: 34 }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Book className="lucide-icon" style={{ position: 'absolute', left: 8, top: 12, opacity: 0.72 }} size={18} />
              <select
                name="serviceid"
                onChange={handleChange}
                required
                className="signup-input"
                style={{ paddingLeft: 34 }}
                value={details.serviceid || ''}
              >
                <option value="">-- Select Service --</option>
                {services.length ? (
                  services.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))
                ) : (
                  <option disabled>Loading services...</option>
                )}
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <User className="lucide-icon" style={{ position: 'absolute', left: 8, top: 12, opacity: 0.7 }} size={18} />
              <select name="panditid" onChange={handleChange} required className="signup-input" style={{ paddingLeft: 34 }}
                value={details.panditid || ''}>
                <option value="">-- Select Pandit --</option>
                {filteredPandits.length ? (
                  filteredPandits.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))
                ) : (
                  <option disabled>No verified pandits available</option>
                )}
              </select>
            </div>
            <div style={{ position: 'relative' }}>
              <Sun className="lucide-icon" style={{ position: 'absolute', left: 8, top: 12, opacity: 0.6 }} size={18} />
              <select name="poojaId" onChange={handleChange} required className="signup-input" style={{ paddingLeft: 34 }}
                value={details.poojaId || ''}>
                <option value="">-- Select Pooja --</option>
                {filteredPoojas.length ? (
                  filteredPoojas.map((pj) => (
                    <option key={pj._id} value={pj._id}>{pj.name}</option>
                  ))
                ) : (
                  <option disabled>No poojas found</option>
                )}
              </select>
            </div>
            <button type="button" onClick={nextStep} className="primary-btn">
              Next
              <ChevronRight size={18} style={{ marginLeft: 7, verticalAlign: 'middle' }} />
            </button>
          </>
        );
      case 2:
        return (
          <>
            <div style={{ position: 'relative' }}>
              <Calendar className="lucide-icon" style={{ position: 'absolute', left: 8, top: 12, opacity: 0.65 }} size={18} />
              <input
                type="date"
                name="puja_date"
                onChange={handleChange}
                required
                className="signup-input"
                style={{ paddingLeft: 34 }}
                value={details.puja_date || ''}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Clock className="lucide-icon" style={{ position: 'absolute', left: 8, top: 12, opacity: 0.67 }} size={18} />
              <input
                type="time"
                name="puja_time"
                onChange={handleChange}
                required
                className="signup-input"
                style={{ paddingLeft: 34 }}
                value={details.puja_time || ''}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <MapPin className="lucide-icon" style={{ position: 'absolute', left: 8, top: 12, opacity: 0.65 }} size={18} />
              <input
                type="text"
                name="location"
                placeholder="Location"
                onChange={handleChange}
                required
                className="signup-input"
                style={{ paddingLeft: 34 }}
                value={details.location || ''}
              />
            </div>
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">
                Back
              </button>
              <button type="button" onClick={nextStep} className="primary-btn">
                Next
                <ChevronRight size={18} style={{ marginLeft: 7, verticalAlign: 'middle' }} />
              </button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="review-title">
              <CheckCircle className="lucide-icon" size={20} style={{ color: "#c98a29" }} />
              Review your booking
            </h3>
            <ul className="review-list">
              <li>
                <Book className="lucide-icon" size={16} />
                Service: {selectedServiceName}
              </li>
              <li>
                <User className="lucide-icon" size={16} />
                Pandit: {pandits.find(p => p._id === details.panditid)?.name}
              </li>
              <li>
                <Sun className="lucide-icon" size={16} />
                Pooja: {(selectedServiceName === 'Astrological Service'
                  ? astrologicalPoojas.find(pj => pj._id === details.poojaId)
                  : poojas.find(pj => pj._id === details.poojaId))?.name}
              </li>
              <li>
                <Calendar className="lucide-icon" size={16} />
                Date: {details.puja_date}
              </li>
              <li>
                <Clock className="lucide-icon" size={16} />
                Time: {details.puja_time}
              </li>
              <li>
                <MapPin className="lucide-icon" size={16} />
                Location: {details.location}
              </li>
            </ul>
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">
                Back
              </button>
              <button type="submit" className="primary-btn">
                <CheckCircle size={18} style={{ marginRight: 7, verticalAlign: 'middle' }} />
                Book Now
              </button>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="booking-bg">
      <img src={bgImage} alt="" className="bg-img" draggable={false}/>
      <div className="overlay-gradient"></div>
      <motion.form
        className="glass-form-pro"
        onSubmit={handleSubmit}
        initial={{ scale: 0.98, opacity: 0, y: 38 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut'}}
      >
        <motion.h2
          className="booking-title"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.13 }}
        >
          Book Pandit Ji for Your Puja
        </motion.h2>
        <div className="steps-nav only-box">
          {stepTitles.map((title, idx) => (
            <motion.div
              key={title}
              className={`steps-circle onlybox ${step === idx+1 ? 'active' : ''}`}
              animate={{ scale: step === idx+1 ? 1.07 : 1 }}
              transition={{ type: "spring", stiffness: 220 }}
            >
              <span className="step-label step-label-box">{title}</span>
            </motion.div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.45, ease: 'anticipate' }}
            className="animated-step"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </motion.form>
    </div>
  );
}

export default Booking;
