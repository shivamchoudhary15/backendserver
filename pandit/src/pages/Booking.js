import React, { useState, useEffect } from 'react';
import { createBooking, getBookings } from '../api/api';

function Booking() {
  const [details, setDetails] = useState({
    serviceid: '',
    panditid: '',
    poojaId: '',
    puja_date: '',
    puja_time: '',
    location: '',
  });

  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const userid = user?._id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, panditRes, poojaRes] = await Promise.all([
          fetch('http://localhost:5000/api/services/view'),
          fetch('http://localhost:5000/api/pandits/view'),
          fetch('http://localhost:5000/api/poojas/view'),
        ]);

        const [servicesData, panditsData, poojasData] = await Promise.all([
          serviceRes.json(),
          panditRes.json(),
          poojaRes.json(),
        ]);

        setServices(servicesData);
        setPandits(panditsData);
        setPoojas(poojasData);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userid) return;
      try {
        const res = await getBookings(userid);
        setBookings(res.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };
    fetchBookings();
  }, [userid]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { serviceid, panditid, poojaId, puja_date, puja_time, location } = details;

    if (!serviceid || !panditid || !poojaId || !puja_date || !puja_time || !location) {
      alert('Please fill all fields');
      return;
    }

    if (!token || !userid) {
      alert('You must be logged in to book a service.');
      return;
    }

    const bookingData = {
      userid,
      serviceid,
      panditid,
      puja_date,
      puja_time,
      location,
      SamanList: poojaId,
    };

    try {
      await createBooking(bookingData);
      alert('✅ Booking created successfully!');
      setDetails({
        serviceid: '',
        panditid: '',
        poojaId: '',
        puja_date: '',
        puja_time: '',
        location: '',
      });
      const updated = await getBookings(userid);
      setBookings(updated.data);
    } catch (error) {
      console.error('Booking API error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '40px 10%' }}>
      <form onSubmit={handleSubmit}>
        {/* Service */}
        <select name="serviceid" value={details.serviceid} onChange={handleChange} required style={inputStyle}>
          <option value="">-- Select Service --</option>
          {services.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>

        {/* Pandit */}
        <select name="panditid" value={details.panditid} onChange={handleChange} required style={inputStyle}>
          <option value="">-- Select Pandit --</option>
          {pandits.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>

        {/* Pooja */}
        <select name="poojaId" value={details.poojaId} onChange={handleChange} required style={inputStyle}>
          <option value="">-- Select Pooja --</option>
          {poojas.map((pooja) => (
            <option key={pooja._id} value={pooja._id}>{pooja.name}</option>
          ))}
        </select>

        {/* Date, Time, Location */}
        <input type="date" name="puja_date" value={details.puja_date} onChange={handleChange} required style={inputStyle} />
        <input type="time" name="puja_time" value={details.puja_time} onChange={handleChange} required style={inputStyle} />
        <input type="text" name="location" placeholder="Location" value={details.location} onChange={handleChange} required style={inputStyle} />

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  marginBottom: '16px',
  width: '100%',
  padding: '12px',
  fontSize: '16px',
};

export default Booking;





