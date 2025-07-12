// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('/api/pandits/view').then(r => r.json()).then(setPandits);
    fetch('/api/poojas/view').then(r => r.json()).then(setPoojas);
  }, []);

  const filteredPandits = pandits.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPoojas = poojas.filter(pj =>
    pj.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleBooking = () => {
    if (token) navigate('/booking');
    else {
      alert('Please login'); 
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      {/* Navbar & Hero omitted for brevity */}

      <section id="search" className="search-bar">
        <input
          type="text"
          placeholder="Search Pandits or Poojas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </section>

      <section id="services" className="services">
        <h2>Poojas</h2>
        <div className="card-grid">
          {filteredPoojas.map((pj, idx) => (
            <div key={pj._id} className="service-card" onClick={() => setSelectedService(pj)}>
              <img src={pj.imageUrl} alt={pj.name} />
              <h3>{pj.name}</h3>
            </div>
          ))}
        </div>
        {selectedService && (
          <div className="service-description">
            <h3>{selectedService.name}</h3>
            <p>{selectedService.description}</p>
            <button onClick={() => setSelectedService(null)}>Close</button>
          </div>
        )}
      </section>

      <section id="pandits" className="pandits">
        <h2>Pandits</h2>
        <div className="pandit-grid">
          {filteredPandits.map(p => (
            <div key={p._id} className="pandit-card">
              <img src={p.profile_photo_url} alt={p.name} />
              <h4>{p.name}</h4>
              <p>{p.city} | {p.experienceYears}+ yrs exp</p>
              <p>🗣 {p.languages}</p>
              <p>🎯 {p.specialties}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
    </div>
  );
};

export default Home;
