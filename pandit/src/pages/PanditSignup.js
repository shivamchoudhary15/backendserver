import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function PanditSignup() {
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

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Convert comma-separated fields into arrays
    const formData = {
      ...form,
      languages: form.languages.split(',').map(item => item.trim()),
      specialties: form.specialties.split(',').map(item => item.trim())
    };

    try {
      const res = await axios.post('https://backendserver-auhk.onrender.com/api/pandits/signup', formData);
      alert('✅ Pandit registered successfully! Please wait for admin verification.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>🧘 Pandit Signup</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required style={styles.input} />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required style={styles.input} />
        <input name="email" placeholder="Email Address" type="email" value={form.email} onChange={handleChange} required style={styles.input} />
        <input name="password" placeholder="Password (8 chars)" type="password" value={form.password} onChange={handleChange} required minLength={8} maxLength={8} style={styles.input} />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} style={styles.input} />
        <input name="experienceYears" placeholder="Years of Experience" type="number" value={form.experienceYears} onChange={handleChange} style={styles.input} />
        <input name="languages" placeholder="Languages (comma-separated)" value={form.languages} onChange={handleChange} style={styles.input} />
        <input name="specialties" placeholder="Specialties (comma-separated)" value={form.specialties} onChange={handleChange} style={styles.input} />
        <textarea name="bio" placeholder="Short Bio" value={form.bio} onChange={handleChange} rows={3} style={styles.input}></textarea>
        <input name="profile_photo_url" placeholder="Profile Photo URL" value={form.profile_photo_url} onChange={handleChange} style={styles.input} />

        <button type="submit" style={styles.button}>📩 Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '500px',
    margin: '80px auto',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#fdfdfd',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '10px',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '14px',
  },
};
