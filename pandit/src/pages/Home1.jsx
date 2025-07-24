import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPandits, getAllDevotees, getAllPoojas } from '../api/api';
import './Home1.css';

function Home1() {
  const [stats, setStats] = useState({ pandits: 0, devotees: 0, bookings: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [p, d, poojas] = await Promise.all([
          getAllPandits(),
          getAllDevotees(),
          getAllPoojas(),
        ]);
        const bookingCount = poojas.data.reduce((acc, pj) => acc + (pj.bookingsCount || 0), 0);
        setStats({ pandits: p.data.length, devotees: d.data.length, bookings: bookingCount });
      } catch (e) {
        console.error('Fetch stats error', e);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="home1-container">
      <div
        role="button"
        tabIndex={0}
        className="card card-pandits"
        onClick={() => navigate('/admin/pandits')}
        onKeyPress={() => navigate('/admin/pandits')}
      >
        <h3>{stats.pandits}</h3>
        <p>Total Pandits</p>
      </div>
      <div
        role="button"
        tabIndex={0}
        className="card card-devotees"
        onClick={() => navigate('/admin/devotees')}
        onKeyPress={() => navigate('/admin/devotees')}
      >
        <h3>{stats.devotees}</h3>
        <p>Total Devotees</p>
      </div>
      <div
        role="button"
        tabIndex={0}
        className="card card-bookings"
        onClick={() => navigate('/admin/bookings')}
        onKeyPress={() => navigate('/admin/bookings')}
      >
        <h3>{stats.bookings}</h3>
        <p>Total Pooja Bookings</p>
      </div>
    </div>
  );
}

export default Home1;
