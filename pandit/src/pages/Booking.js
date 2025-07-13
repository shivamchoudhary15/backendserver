// src/pages/Booking.js

import React, { useState, useEffect } from 'react';
import { createBooking, getBookings } from '../api/api';
import './Booking.css';

function Booking() {
  const [details, setDetails] = useState({});
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [search, setSearch] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const userid = user?._id;

  useEffect(() => {
    async function load() {
      try {
        const [sv, pd, pj] = await Promise.all([
          fetch('/api/services/view'),
          fetch('/api/pandits/view'),
          fetch('/api/poojas/view'),
        ]);
        setServices(await sv.json());
        setPandits(await pd.json());
        setPoojas(await pj.json());
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!userid) return;
    getBookings(userid).then((r) => setBookings(r.data));
  }, [userid]);

  const filteredPandits = pandits.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPoojas = poojas.filter((pj) =>
    pj.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { serviceid, panditid, poojaId, puja_date, puja_time, location } = details;

    if (!serviceid || !panditid || !poojaId || !puja_date || !puja_time || !location) {
      alert('Please fill all fields');
      return;
    }

    const exists = bookings.some(
      (b) =>
        b.panditid === panditid &&
        b.puja_date === puja_date &&
        b.status === 'accepted'
    );
    if (exists) {
      alert('Pandit already booked that day');
      return;
    }

    await createBooking({ ...details, userid });
    alert('✅ Booking created!');
    getBookings(userid).then((r) => setBookings(r.data));
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <h2>📘 Book Pandit Ji for Your Puja</h2>

        <input
          type="text"
          placeholder="Search Pandit or Pooja"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />

        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-group">
            <select
              name="serviceid"
              onChange={(e) => setDetails({ ...details, serviceid: e.target.value })}
              required
            >
              <option value="">-- Service --</option>
              {services.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
            <label>Service</label>
          </div>

          <div className="form-group">
            <select
              name="panditid"
              onChange={(e) => setDetails({ ...details, panditid: e.target.value })}
              required
            >
              <option value="">-- Pandit --</option>
              {filteredPandits.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <label>Select Pandit</label>
          </div>

          <div className="form-group">
            <select
              name="poojaId"
              onChange={(e) => setDetails({ ...details, poojaId: e.target.value })}
              required
            >
              <option value="">-- Pooja --</option>
              {filteredPoojas.map((pj) => (
                <option key={pj._id} value={pj._id}>
                  {pj.name}
                </option>
              ))}
            </select>
            <label>Select Pooja</label>
          </div>

          <div className="form-group">
            <input
              type="date"
              name="puja_date"
              onChange={(e) => setDetails({ ...details, puja_date: e.target.value })}
              required
            />
            <label>Puja Date</label>
          </div>

          <div className="form-group">
            <input
              type="time"
              name="puja_time"
              onChange={(e) => setDetails({ ...details, puja_time: e.target.value })}
              required
            />
            <label>Puja Time</label>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="location"
              placeholder=" "
              onChange={(e) => setDetails({ ...details, location: e.target.value })}
              required
            />
            <label>Location</label>
          </div>

          <button type="submit" className="submit-btn">
            📿 Book Pandit Ji
          </button>
        </form>

        <h2 style={{ marginTop: '2rem' }}>Your Bookings</h2>
        <ul className="booking-list">
          {bookings.map((b) => (
            <li key={b._id}>
              {b.puja_date} - {b.puja_time} with {b.panditid?.name || 'Pandit'} -{' '}
              <strong>{b.status}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="right-side">
        <img
          src="https://github.com/shivamchoudhary15/backendserver/blob/main/pandit/public/images/images.jpeg?raw=true"
          alt="Puja Background"
          className="side-image"
        />
      </div>
    </div>
  );
}

export default Booking;
