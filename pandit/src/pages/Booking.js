import React, { useState, useEffect } from 'react';
import { createBooking, getBookings } from '../api/api';

const availableServices = [
  { id: 's1', name: 'Home Pooja' },
  { id: 's2', name: 'Temple Pooja' },
  { id: 's3', name: 'Online Pooja' },
];

const indianPandits = [
  { id: 'p1', name: 'Pandit Rajesh Sharma' },
  { id: 'p2', name: 'Pandit Vinod Mishra' },
  { id: 'p3', name: 'Pandit Mahesh Tripathi' },
  { id: 'p4', name: 'Pandit Hari Om Joshi' },
  { id: 'p5', name: 'Pandit Gopal Das' },
];

const popularPoojas = [
  { id: 'po1', name: 'Ganesh Puja' },
  { id: 'po2', name: 'Satyanarayan Katha' },
  { id: 'po3', name: 'Navagraha Shanti' },
  { id: 'po4', name: 'Griha Pravesh Puja' },
  { id: 'po5', name: 'Rudra Abhishek' },
  { id: 'po6', name: 'Lakshmi Puja' },
  { id: 'po7', name: 'Mundan Sanskar' },
  { id: 'po8', name: 'Naamkaran Sanskar' },
  { id: 'po9', name: 'Kaal Sarp Dosh Nivaran' },
  { id: 'po10', name: 'Hanuman Chalisa Paath' },
];

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
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const userid = user?._id;

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
      alert('❌ Please fill all fields');
      return;
    }

    if (!token || !userid) {
      alert('⚠️ You must be logged in to book a service.');
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
      alert(error.response?.data?.error || '❌ Booking failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Segoe UI, sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: 'auto', background: '#fff9f4', padding: 20, borderRadius: 10, boxShadow: '0 0 10px #ddd' }}>
        <h2 style={{ textAlign: 'center' }}>📅 Book a Pooja</h2>

        <label>🛕 Service</label>
        <select name="serviceid" value={details.serviceid} onChange={handleChange} required>
          <option value="">-- Select Service --</option>
          {availableServices.map((service) => (
            <option key={service.id} value={service.id}>{service.name}</option>
          ))}
        </select>

        <label>🧘 Pandit</label>
        <select name="panditid" value={details.panditid} onChange={handleChange} required>
          <option value="">-- Select Pandit --</option>
          {indianPandits.map((pandit) => (
            <option key={pandit.id} value={pandit.id}>{pandit.name}</option>
          ))}
        </select>

        <label>📖 Pooja</label>
        <select name="poojaId" value={details.poojaId} onChange={handleChange} required>
          <option value="">-- Select Pooja --</option>
          {popularPoojas.map((pooja) => (
            <option key={pooja.id} value={pooja.id}>{pooja.name}</option>
          ))}
        </select>

        <label>📅 Date</label>
        <input type="date" name="puja_date" value={details.puja_date} onChange={handleChange} required />

        <label>⏰ Time</label>
        <input type="time" name="puja_time" value={details.puja_time} onChange={handleChange} required />

        <label>📍 Location</label>
        <input type="text" name="location" placeholder="e.g. Delhi, Mumbai..." value={details.location} onChange={handleChange} required />

        <button type="submit" style={{ marginTop: 20, width: '100%', padding: '10px', backgroundColor: '#2c7be5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          📩 Book Now
        </button>
      </form>

      <hr style={{ margin: '50px 0' }} />

      <h2 style={{ textAlign: 'center' }}>📝 Your Bookings</h2>
      {bookings.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No bookings found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, maxWidth: 700, margin: 'auto' }}>
          {bookings.map((booking) => (
            <li key={booking._id} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f1f9ff', borderRadius: '6px' }}>
              <strong>📖 Pooja:</strong> {booking.SamanList} <br />
              <strong>🗓 Date:</strong> {booking.puja_date} <br />
              <strong>⏰ Time:</strong> {booking.puja_time} <br />
              <strong>📍 Location:</strong> {booking.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Booking;







