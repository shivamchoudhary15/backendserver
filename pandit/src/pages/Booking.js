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
    <div style={{ padding: '40px 10%', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 800,
          margin: 'auto',
          background: '#fff',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>📅 Book a Pooja</h2>

        {/* Service */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>🛕 Select Service:</label>
          <select name="serviceid" value={details.serviceid} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select Service --</option>
            {availableServices.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </div>

        {/* Pandit */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>🧘 Choose Pandit:</label>
          <select name="panditid" value={details.panditid} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select Pandit --</option>
            {indianPandits.map((pandit) => (
              <option key={pandit.id} value={pandit.id}>{pandit.name}</option>
            ))}
          </select>
        </div>

        {/* Pooja */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>📖 Select Pooja:</label>
          <select name="poojaId" value={details.poojaId} onChange={handleChange} required style={inputStyle}>
            <option value="">-- Select Pooja --</option>
            {popularPoojas.map((pooja) => (
              <option key={pooja.id} value={pooja.id}>{pooja.name}</option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>📅 Pooja Date:</label>
          <input type="date" name="puja_date" value={details.puja_date} onChange={handleChange} required style={inputStyle} />
        </div>

        {/* Time */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>⏰ Pooja Time:</label>
          <input type="time" name="puja_time" value={details.puja_time} onChange={handleChange} required style={inputStyle} />
        </div>

        {/* Location */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>📍 Location:</label>
          <input
            type="text"
            name="location"
            placeholder="e.g. Delhi, Mumbai..."
            value={details.location}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '14px 24px',
            width: '100%',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          📩 Book Now
        </button>
      </form>

      {/* Booking History */}
      <div style={{ maxWidth: 800, margin: '60px auto 0' }}>
        <h2 style={{ textAlign: 'center' }}>📝 Your Bookings</h2>
        {bookings.length === 0 ? (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>No bookings found.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
            {bookings.map((booking) => (
              <li
                key={booking._id}
                style={{
                  backgroundColor: '#eaf5ff',
                  marginBottom: '20px',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                <p><strong>📖 Pooja:</strong> {booking.SamanList}</p>
                <p><strong>🗓 Date:</strong> {booking.puja_date}</p>
                <p><strong>⏰ Time:</strong> {booking.puja_time}</p>
                <p><strong>📍 Location:</strong> {booking.location}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

export default Booking;








