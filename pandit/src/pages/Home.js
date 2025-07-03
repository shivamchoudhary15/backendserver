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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🕉️ Pandit Booking App</h1>
        <p style={styles.subtitle}>Book experienced pandits for your spiritual needs</p>
      </header>

      <section style={styles.servicesSection}>
        <h2 style={styles.sectionTitle}>🛕 Available Pooja Services</h2>
        <ul style={styles.serviceList}>
          {services.length > 0 ? (
            services.map((service) => (
              <li key={service._id} style={styles.serviceItem}>
                {service.name}
              </li>
            ))
          ) : (
            <li style={styles.loading}>Loading services...</li>
          )}
        </ul>
      </section>

      <section style={styles.actionSection}>
        {!token ? (
          <>
            <h3 style={styles.sectionTitle}>🚀 Get Started</h3>
            <div>
              <Link to="/signup">
                <button style={{ ...styles.button, ...styles.primary }}>Signup</button>
              </Link>
              <Link to="/login">
                <button style={{ ...styles.button, ...styles.secondary }}>Login</button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 style={styles.sectionTitle}>👋 Welcome Back</h3>
            <div>
              <button style={{ ...styles.button, ...styles.primary }} onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </button>
              <button style={{ ...styles.button, ...styles.secondary }} onClick={handleBookingClick}>
                Book a Pooja
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Arial, sans-serif',
    background: '#f4f6f9',
    minHeight: '100vh',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    marginBottom: '10px',
    color: '#333',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
  },
  servicesSection: {
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '24px',
    color: '#444',
    marginBottom: '10px',
  },
  serviceList: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  serviceItem: {
    backgroundColor: '#fff',
    padding: '12px 20px',
    marginBottom: '10px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  loading: {
    fontStyle: 'italic',
    color: '#999',
  },
  actionSection: {
    textAlign: 'center',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    margin: '10px',
    cursor: 'pointer',
    border: 'none',
  },
  primary: {
    backgroundColor: '#2c7be5',
    color: '#fff',
  },
  secondary: {
    backgroundColor: '#f4b400',
    color: '#fff',
  },
};

export default Home;
