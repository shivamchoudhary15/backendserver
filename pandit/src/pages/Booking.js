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

  // Fetch dynamic dropdown data
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

  // Fetch bookings on mount
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









