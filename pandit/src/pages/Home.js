import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getServices } from '../api/api';
import { motion } from 'framer-motion';

function Home() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
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

  const filteredServices = (services.length > 0 ? services : dummyServices).filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🙏 Welcome to Pandit Booking</h1>
        <p style={styles.subtitle}>Book experienced Pandits for your spiritual needs</p>
      </header>

      <section style={{ textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search for a Pooja..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </section>

      <section>
        <h2 style={styles.sectionTitle}>🛕 Popular Hindu Pooja Services</h2>
        <div style={styles.cardGrid}>
          {filteredServices.map((service, index) => (
            <motion.div
              key={index}
              style={styles.card}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={service.image || dummyImages[index % dummyImages.length]}
                alt={service.name}
                style={styles.cardImage}
              />
              <h3 style={styles.cardTitle}>{service.name}</h3>
              <p style={styles.cardDesc}>{service.description || 'This pooja brings spiritual peace and prosperity.'}</p>
            </motion.div>
          ))}
        </div>
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

const dummyServices = [
  { name: 'Ganesh Puja', description: 'Removes obstacles and ensures success.' },
  { name: 'Satyanarayan Katha', description: 'For prosperity and blessings in life.' },
  { name: 'Navagraha Shanti', description: 'Balances planetary influences.' },
  { name: 'Griha Pravesh', description: 'Performed before entering a new home.' },
  { name: 'Rudra Abhishek', description: 'Puja of Lord Shiva for inner peace.' },
  { name: 'Lakshmi Puja', description: 'Invokes wealth and abundance.' },
];

const dummyImages = [
  'https://cdn.pixabay.com/photo/2018/08/14/13/23/hindu-3602305_960_720.jpg',
  'https://cdn.pixabay.com/photo/2017/08/06/14/49/indian-2593170_960_720.jpg',
  'https://cdn.pixabay.com/photo/2015/12/01/20/28/diya-1079335_960_720.jpg',
  'https://cdn.pixabay.com/photo/2020/10/17/12/27/diwali-5661464_960_720.jpg',
  'https://cdn.pixabay.com/photo/2016/11/29/05/09/ritual-1867374_960_720.jpg',
  'https://cdn.pixabay.com/photo/2017/09/30/20/02/ganesh-2808277_960_720.jpg',
];

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif',
    background: 'linear-gradient(to bottom right, #f7f0e8, #fff6f1)',
    minHeight: '100vh',
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '40px',
    color: '#b30059',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
  },
  sectionTitle: {
    fontSize: '26px',
    color: '#2e4053',
    marginBottom: '20px',
    textAlign: 'center',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    padding: '10px 0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '15px',
    textAlign: 'center',
  },
  cardImage: {
    width: '100%',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  cardTitle: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#444',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
  },
  actionSection: {
    textAlign: 'center',
    marginTop: '50px',
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
  searchInput: {
    padding: '10px',
    width: '60%',
    fontSize: '16px',
    marginBottom: '30px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
};

export default Home;

