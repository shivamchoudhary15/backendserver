import React, { useEffect, useState } from 'react';
import { getAllDevotees } from '../api/api';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import './DevoteesPage.css';

function DevoteesPage() {
  const [devotees, setDevotees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchDevotees();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [devotees, search, city]);

  async function fetchDevotees() {
    try {
      const res = await getAllDevotees();
      setDevotees(res.data);
    } catch (err) {
      // handle error
    }
  }

  function handleFilter() {
    let res = [...devotees];
    if (search.trim())
      res = res.filter(d =>
        d.name.toLowerCase().includes(search.trim().toLowerCase())
      );
    if (city)
      res = res.filter(d =>
        d.city && d.city.toLowerCase().includes(city.toLowerCase())
      );
    setFiltered(res);
  }

  const uniqueCities = Array.from(new Set(devotees.map(d => d.city).filter(c => c)));

  // For slideshow
  const topDevotees = devotees.slice(0, 6);

  return (
    <div className="devotees-page">
      <h2>Devotees Management</h2>
      <div className="filters-row">
        <input
          type="text"
          value={search}
          placeholder="Search by name"
          onChange={e => setSearch(e.target.value)}
          className="filter-input"
        />
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="filter-input"
        >
          <option value="">All Cities</option>
          {uniqueCities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="highlighted-slideshow">
        <Slide autoplay={true} interval={3200} arrows={false} indicators={true}>
          {topDevotees.map(d => (
            <div className="devotee-slide" key={d._id}>
              <div className="avatar-circle">{d.name[0]}</div>
              <div className="devotee-slide-info">
                <p>
                  <strong>{d.name}</strong> <br />
                  <span className="slide-city">{d.city}</span>
                </p>
                <p className="slide-email">{d.email}</p>
              </div>
            </div>
          ))}
        </Slide>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-msg">No devotees found.</p>
      ) : (
        <div className="devotee-grid">
          {filtered.map(d => (
            <div key={d._id} className="devotee-card">
              <div className="avatar-circle">{d.name[0]}</div>
              <div className="devotee-info">
                <p>
                  <strong>{d.name}</strong>
                  <span className="devotee-city">({d.city})</span>
                </p>
                <p className="devotee-email">{d.email}</p>
                <p>Phone: {d.phone || 'N/A'}</p>
                <p>Joined: {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</p>
                {/* Add more details here if available */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DevoteesPage;
