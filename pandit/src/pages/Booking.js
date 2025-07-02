import React, { useState, useEffect } from 'react';
import { createBooking, getBookings } from '../api/api';

const dummyServices = [
  { id: 's1', name: 'Pooja A' },
  { id: 's2', name: 'Pooja B' },
  { id: 's3', name: 'Pooja C' },
];

const dummyPandits = [
  { id: 'p1', name: 'Shubham Singhal' },
  { id: 'p2', name: 'Shyam Sundar' },
  { id: 'p3', name: 'Satyam Vashney' },
];

const dummyPoojas = [
  { id: 'po1', name: 'Ganesh Puja' },
  { id: 'po2', name: 'Satyanarayan Puja' },
  { id: 'po3', name: 'Navagraha Puja' },
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

  // Fetch all bookings for logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userid) return;

      try {
        const res = await getBookings(userid); // Pass userid as param
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

      // Refresh bookings
      const updated = await getBookings(userid);
      setBookings(updated.data);
    } catch (error) {
      console.error('Booking API error:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>📅 Book a Service</h2>

        <label>
          Service:
          <select name="serviceid" value={details.serviceid} onChange={handleChange} required>
            <option value="">Select Service</option>
            {dummyServices.map((service) => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Pandit:
          <select name="panditid" value={details.panditid} onChange={handleChange} required>
            <option value="">Select Pandit</option>
            {dummyPandits.map((pandit) => (
              <option key={pandit.id} value={pandit.id}>{pandit.name}</option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Pooja:
          <select name="poojaId" value={details.poojaId} onChange={handleChange} required>
            <option value="">Select Pooja</option>
            {dummyPoojas.map((pooja) => (
              <option key={pooja.id} value={pooja.id}>{pooja.name}</option>
            ))}
          </select>
        </label>
        <br />

        <label>
          Date:
          <input type="date" name="puja_date" value={details.puja_date} onChange={handleChange} required />
        </label>
        <br />

        <label>
          Time:
          <input type="time" name="puja_time" value={details.puja_time} onChange={handleChange} required />
        </label>
        <br />

        <label>
          Location:
          <input type="text" name="location" value={details.location} onChange={handleChange} required />
        </label>
        <br />

        <button type="submit">📩 Book Now</button>
      </form>

      <hr />

      <h2>📝 Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking._id}>
              <strong>Pooja:</strong> {booking.SamanList} | <strong>Date:</strong> {booking.puja_date} | <strong>Time:</strong> {booking.puja_time} | <strong>Location:</strong> {booking.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Booking;





