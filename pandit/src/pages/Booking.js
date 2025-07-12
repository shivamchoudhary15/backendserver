// src/pages/Booking.js
import React, { useState, useEffect } from 'react';
import { createBooking, getBookings } from '../api/api';

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
      const [sv, pd, pj] = await Promise.all([
        fetch('/api/services/view'),
        fetch('/api/pandits/view'),
        fetch('/api/poojas/view'),
      ]);
      setServices(await sv.json());
      setPandits(await pd.json());
      setPoojas(await pj.json());
    }
    load();
  }, []);

  useEffect(() => {
    if (!userid) return;
    getBookings(userid).then(r => setBookings(r.data));
  }, [userid]);

  const filteredPandits = pandits.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPoojas = poojas.filter(pj =>
    pj.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async e => {
    e.preventDefault();
    const { serviceid, panditid, poojaId, puja_date, puja_time, location } = details;
    if (!serviceid || !panditid || !poojaId || !puja_date || !puja_time || !location) {
      alert('Please fill all fields'); return;
    }
    const exists = bookings.some(b =>
      b.panditid === panditid && b.puja_date === puja_date && b.status === 'accepted'
    );
    if (exists) { alert('Pandit already booked that day'); return; }

    await createBooking({ ...details, userid });
    alert('✅ Booking created!');
    getBookings(userid).then(r => setBookings(r.data));
  };

  return (
    <div className="booking-form">
      <h2>Book Pooja</h2>
      <input
        type="text"
        placeholder="Search Pandit or Pooja"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <form onSubmit={handleSubmit}>
        <select name="serviceid" onChange={e => setDetails({...details, serviceid: e.target.value})}>
          <option value="">-- Service --</option>
          {services.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>

        <select name="panditid" onChange={e => setDetails({...details, panditid: e.target.value})}>
          <option value="">-- Pandit --</option>
          {filteredPandits.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <select name="poojaId" onChange={e => setDetails({...details, poojaId: e.target.value})}>
          <option value="">-- Pooja --</option>
          {filteredPoojas.map(pj => <option key={pj._id} value={pj._id}>{pj.name}</option>)}
        </select>

        <input type="date" name="puja_date" onChange={e => setDetails({...details, puja_date: e.target.value})}/>
        <input type="time" name="puja_time" onChange={e => setDetails({...details, puja_time: e.target.value})}/>
        <input type="text" name="location" placeholder="Location" onChange={e => setDetails({...details, location: e.target.value})} />

        <button type="submit">Book Now</button>
      </form>

      <h2>Your Bookings</h2>
      <ul>
        {bookings.map(b => (
          <li key={b._id}>
            {b.puja_date} - {b.puja_time} with {b.panditid.name} - <strong>{b.status}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Booking;
