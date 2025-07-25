// src/pages/Home1.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllDevotees, getAllPandits, getBookings } from '../api/api';
import './Home1.css';

function Home1() {
  const [stats, setStats] = useState({ devotees: 0, pandits: 0, bookings: 0 });
  const navigate = useNavigate();

  // You can customize this with your admin user's real name later dynamically if needed
  const adminName = 'Welcome Admin ji ';

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
    <div className="home1-container">
      <header className="home1-header">
        <img src="/images/subh.png" alt="Subh Logo" className="home1-logo" />
        <h1 className="welcome-message">Welcome {adminName} ji</h1>
      </header>

      <div className="dashboard-cards-container">
        <div className="dashboard-card pulse" onClick={() => navigate('/admin/devotees')} tabIndex={0} role="button" aria-label="Navigate to Devotees">
          <span className="dashboard-card-title">Total Devotees</span>
          <span className="dashboard-card-value">{stats.devotees}</span>
        </div>
        <div className="dashboard-card pulse" onClick={() => navigate('/admin/pandits')} tabIndex={0} role="button" aria-label="Navigate to Pandits">
          <span className="dashboard-card-title">Total Pandits</span>
          <span className="dashboard-card-value">{stats.pandits}</span>
        </div>
        <div className="dashboard-card pulse" onClick={() => navigate('/admin/bookings')} tabIndex={0} role="button" aria-label="Navigate to Bookings">
          <span className="dashboard-card-title">Total Bookings</span>
          <span className="dashboard-card-value">{stats.bookings}</span>
        </div>
      </div>
    </div>
  );
}

export default Home1;
