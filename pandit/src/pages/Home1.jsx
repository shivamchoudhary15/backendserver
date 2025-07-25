// src/pages/Home1.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDevotees, getAllPandits, getBookings } from '../api/api';
import './Home1.css';

function Home1() {
  const [stats, setStats] = useState({ devotees: 0, pandits: 0, bookings: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [devoteesRes, panditsRes, bookingsRes] = await Promise.all([
          getAllDevotees(),
          getAllPandits(),
          getBookings(),
        ]);
        setStats({
          devotees: devoteesRes.data.length,
          pandits: panditsRes.data.length,
          bookings: bookingsRes.data.length,
        });
      } catch (err) {
        console.error('Error fetching counts', err);
      }
    }
    fetchCounts();
  }, []);

  return (
    <div className="dashboard-cards-container">
      <div className="dashboard-card pulse" onClick={() => navigate('/admin/devotees')} tabIndex={0}>
        <span className="dashboard-card-title">Total Devotees</span>
        <span className="dashboard-card-value">{stats.devotees}</span>
      </div>
      <div className="dashboard-card pulse" onClick={() => navigate('/admin/pandits')} tabIndex={0}>
        <span className="dashboard-card-title">Total Pandits</span>
        <span className="dashboard-card-value">{stats.pandits}</span>
      </div>
      <div className="dashboard-card pulse" onClick={() => navigate('/admin/bookings')} tabIndex={0}>
        <span className="dashboard-card-title">Total Bookings</span>
        <span className="dashboard-card-value">{stats.bookings}</span>
      </div>
    </div>
  );
}

export default Home1;
