import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/api';

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
      alert('✅ Signup successful! You can now log in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error || '❌ Signup failed');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>📝 Create Your Account</h2>

        <label style={styles.label}>Name</label>
        <input
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Email</label>
        <input
          name="email"
          placeholder="Enter your email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Phone</label>
        <input
          name="phone"
          placeholder="Enter your phone number"
          value={form.phone}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>City (optional)</label>
        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          style={styles.input}
        />

        <label style={styles.label}>Address (optional)</label>
        <input
          name="address"
          placeholder="Complete address"
          value={form.address}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>🚀 Signup</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '500px',
    margin: 'auto',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  heading: {
    textAlign: 'center',
    fontSize: '26px',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  button: {
    marginTop: '20px',
    padding: '12px',
    fontSize: '18px',
    backgroundColor: '#2c7be5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  }
};
