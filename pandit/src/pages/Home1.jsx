import React, { useEffect, useState } from 'react';
import { getAllPandits, getAllDevotees, getBookings } from '../api/api';
import './Home1.css';

function Home1() {
  const [counts, setCounts] = useState({
    pandits: 0,
    devotees: 0,
    bookings: 0
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [panditsRes, devoteesRes, bookingsRes] = await Promise.all([
          getAllPandits(),
          getAllDevotees(),
          getBookings()
        ]);
        setCounts({
          pandits: panditsRes.data.length,
          devotees: devoteesRes.data.length,
          bookings: bookingsRes.data.length
        });
      } catch (err) {
        // Handle error
      }
    }
    fetchData();
  }, []);

  return (
    <div className="home-container">
      <h1 className="dashboard-title">Admin Dashboard Overview</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card blue">
          <div className="card-icon">🧑‍🎓</div>
          <div>
            <div className="card-title">Total Pandits</div>
            <div className="card-value">{counts.pandits}</div>
          </div>
        </div>
        <div className="dashboard-card green">
          <div className="card-icon">🙏</div>
          <div>
            <div className="card-title">Total Devotees</div>
            <div className="card-value">{counts.devotees}</div>
          </div>
        </div>
        <div className="dashboard-card purple">
          <div className="card-icon">📅</div>
          <div>
            <div className="card-title">Total Pooja Bookings</div>
            <div className="card-value">{counts.bookings}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home1;
