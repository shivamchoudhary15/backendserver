import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const AdminLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('https://backendserver-pf4h.onrender.com/api/users/login', form);
      const { token, user } = res.data;

      if (user?.role !== 'admin') {
        setError('❌ You are not authorized as admin.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      alert('✅ Admin login successful!');
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Login failed.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-right">
        <div className="login-form-box">
          <h2 style={{ textAlign: 'center' }}>🛡 Admin Login</h2>
          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="login-button">Login as Admin</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
