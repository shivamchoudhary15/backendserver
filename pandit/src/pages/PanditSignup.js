import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './PanditSignup.css';

export default function PanditSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
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

  // Profile photo live preview condition
  const isPhoto = form.profile_photo_url && (form.profile_photo_url.startsWith('http') || form.profile_photo_url.includes('/images/'));

  // Validate steps
  const validateStep = () => {
    if (step === 1) {
      if (!form.name.trim()) return "Name is required.";
      if (!form.phone.match(/^[6-9]\d{9}$/)) return "Enter valid 10-digit phone.";
    }
    if (step === 2) {
      if (!form.email.match(/^\S+@\S+\.\S+$/)) return "Enter valid email.";
      if (form.password.length !== 8) return "Password must be exactly 8 characters.";
    }
    return "";
  };

  const nextStep = () => {
    const msg = validateStep();
    if (msg) { setError(msg); return; }
    setError('');
    setStep(step + 1);
  };
  const prevStep = () => setStep(Math.max(1, step - 1));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = {
      ...form,
      languages: form.languages.split(',').map((item) => item.trim()).filter(Boolean),
      specialties: form.specialties.split(',').map((item) => item.trim()).filter(Boolean),
    };
    try {
      await axios.post('https://backendserver-pf4h.onrender.com/api/pandits/signup', formData);
      alert('Pandit registered successfully. Please wait for admin verification.');
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
            <div className="input-label">Name</div>
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} autoFocus />
            <div className="input-label">Phone</div>
            <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} maxLength={10} />
            <motion.button type="button" onClick={nextStep} className="primary-btn" whileTap={{ scale: 0.97 }}>
              Next &rarr;
            </motion.button>
          </>
        );
      case 2:
        return (
          <>
            <div className="input-label">Email Address</div>
            <input name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
            <div className="input-label">Password</div>
            <div className="pw-field">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="Password (8 characters)"
                value={form.password}
                minLength={8}
                maxLength={8}
                onChange={handleChange}
              />
              <span
                className="pw-toggle"
                onClick={() => setShowPass(!showPass)}
                title={showPass ? "Hide" : "Show"}
              >{showPass ? "🙈" : "👁️"}</span>
            </div>
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">&larr; Back</button>
              <button type="button" onClick={nextStep} className="primary-btn">Next &rarr;</button>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="input-label">City</div>
            <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
            <div className="input-label">Experience (years)</div>
            <input name="experienceYears" type="number" min="0" max="80" placeholder="Years of Experience" value={form.experienceYears} onChange={handleChange} />
            <div className="input-label">Languages</div>
            <input name="languages" placeholder="Languages (comma separated)" value={form.languages} onChange={handleChange} />
            <div className="input-label">Specialties</div>
            <input name="specialties" placeholder="Specialties (comma separated)" value={form.specialties} onChange={handleChange} />
            <div className="input-label">Short Bio</div>
            <textarea name="bio" placeholder="Short Bio" rows={2} value={form.bio} onChange={handleChange} />
            <div className="input-label">Profile Photo URL</div>
            <input name="profile_photo_url" placeholder="Paste image URL or /images/..." value={form.profile_photo_url} onChange={handleChange} />
            {isPhoto && (
              <img src={form.profile_photo_url} alt="Profile Preview" className="pandit-profile-preview" onError={e => e.target.style.display='none'} />
            )}
            <div className="step-buttons">
              <button type="button" onClick={prevStep} className="secondary-btn">&larr; Back</button>
              <button type="submit" className="primary-btn">Register</button>
            </div>
          </>
        );
      default: return null;
    }
  };

  const backgroundStyle = {
    minHeight: '100vh',
    backgroundImage: `linear-gradient(124deg, rgba(35,0,36,0.25), rgba(94,50,0,0.32)), url('/images/ho2.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    perspective: '1200px',
  };

  return (
    <div style={backgroundStyle}>
      <form onSubmit={handleSubmit} className="signup-form-3d" style={{ transform: 'rotateY(-6deg) scale(1.04)' }}>
        <img src="/images/subh.png" className="signup-logo-3d" alt="Pandit Portal Logo" />
        <h2>Pandit Signup <span role="img" aria-label="pandit">🕉️</span></h2>
        <div className="step-indicator-3d">
          {[1, 2, 3].map(n => (
            <span key={n} className={`step-dot${step === n ? ' active' : ''}`}>{step === n ? '🔸' : '•'}</span>
          ))}
          <span className="step-label">Step {step} of 3</span>
        </div>
        {error && <div className="error-3d">{error}</div>}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.42 }}
            className="animated-step-3d"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
        <div className="login-link-3d">
          Already registered? <Link to="/login" className="login-link-3d-link">Login</Link>
        </div>
      </form>
    </div>
  );
}
