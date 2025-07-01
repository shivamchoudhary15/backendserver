import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getServices } from '../api/api';

function Home() {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    getServices().then((res) => setServices(res.data));
  }, []);

  const handleBookingClick = () => {
    if (token) {
      navigate('/booking');
    } else {
      alert('Please login first to book a service.');
      navigate('/login');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pandit Booking App</h1>

      <h2>Available Services</h2>
      <ul>
        {services.length > 0 ? (
          services.map((service) => <li key={service._id}>{service.name}</li>)
        ) : (
          <li>Loading services...</li>
        )}
      </ul>

      <div style={{ marginTop: '30px' }}>
        {!token ? (
          <>
            <h3>Get Started</h3>
            <Link to="/signup">
              <button style={{ marginRight: '10px' }}>Signup</button>
            </Link>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </>
        ) : (
          <>
            <h3>Welcome back!</h3>
            <button style={{ marginRight: '10px' }} onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
            <button onClick={handleBookingClick}>Book a Pooja</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;