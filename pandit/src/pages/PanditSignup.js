import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './PanditSignup.css'; // CSS file for styling

export default function PanditSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    city: '',
    experienceYears: '',
    languages: '',
    specialties: '',
    bio: '',
    profile_photo_url: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const formData = {
      ...form,
      languages: form.languages.split(',').map((item) => item.trim()),
      specialties: form.specialties.split(',').map((item) => item.trim()),
    };

    try {
      await axios.post('https://backendserver-pf4h.onrender.com/api/pandits/signup', formData);
      alert('✅ Pandit registered successfully! Please wait for admin verification.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <input name="name" placeholder="🧑 Full Name" value={form.name} onChange={handleChange} required />
            <input name="phone" placeholder="📞 Phone Number" value={form.phone} onChange={handleChange} required />
            <button type="button" onClick={nextStep} className="primary-btn">Next ➡️</button>
          </>
        );
      case 2:
        return (
          <>
            <input name="email" placeholder="📧 Email Address" type="email" value={form.email} onChange={handleChange} required />
            <input name="password" placeholder="🔐 Password (8 chars)" type="password" value={form.password} onChange={handleChange} required minLength={8} maxLength={8} />
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">⬅️ Back</button>
              <button type="button" onClick={nextStep} className="primary-btn">Next ➡️</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <input name="city" placeholder="🏙️ City" value={form.city} onChange={handleChange} />
            <input name="experienceYears" placeholder="⌛ Years of Experience" type="number" value={form.experienceYears} onChange={handleChange} />
            <input name="languages" placeholder="🗣️ Languages (comma-separated)" value={form.languages} onChange={handleChange} />
            <input name="specialties" placeholder="🛕 Specialties (comma-separated)" value={form.specialties} onChange={handleChange} />
            <textarea name="bio" placeholder="📜 Short Bio" value={form.bio} onChange={handleChange} rows={3}></textarea>
            <input name="profile_photo_url" placeholder="🖼️ Profile Photo URL" value={form.profile_photo_url} onChange={handleChange} />
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">⬅️ Back</button>
              <button type="submit" className="primary-btn">📩 Register</button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const backgroundStyle = {
    minHeight: '100vh',
    backgroundImage: `url('/images/back2.jpeg')`, // ✅ From public/images
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  };

  return (
    <div style={backgroundStyle}>
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>🧘 Pandit Signup</h2>
        <p className="step-indicator">Step {step} of 3</p>
        {error && <p className="error">{error}</p>}
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
