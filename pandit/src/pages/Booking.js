import React, { useState } from 'react';
import { createBooking } from '../api/api'; // Assumes Axios is set up to include token

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

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const { serviceid, panditid, poojaId, puja_date, puja_time, location } = details;

  if (!serviceid || !panditid || !poojaId || !puja_date || !puja_time || !location) {
    alert('Please fill all the fields');
    return;
  }

  const token = localStorage.getItem('token');
  const userid = localStorage.getItem('userid'); // 👈 make sure this exists

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
    alert('Booking created successfully!');
    setDetails({
      serviceid: '',
      panditid: '',
      poojaId: '',
      puja_date: '',
      puja_time: '',
      location: '',
    });
  } catch (error) {
    console.error('Booking API error:', error.response?.data || error.message);
    alert(error.response?.data?.error || 'Booking failed. Please try again.');
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>Book a Service</h2>

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

      <button type="submit">Book Now</button>
    </form>
  );
}

export default Booking;



