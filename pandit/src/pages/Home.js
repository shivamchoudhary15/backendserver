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
    getServices()
      .then((res) => setServices(res.data))
      .catch(() => setServices(dummyServices)); // fallback to dummy if error
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
      <nav style={styles.navbar}>
        <div>
          <h1 style={styles.logo}>🕉️ Pandit Booking</h1>
        </div>
     <div style={styles.navLinks}>
         <Link to="/signup" style={styles.navLink}>Join as Devotee</Link>
        <Link to="/signup/pandit" style={styles.navLink}>Register as Pandit</Link>
        <Link to="/login" style={styles.navLink}>Login</Link>
     </div>

      </nav>

      <header style={styles.header}>
        <h2 style={styles.title}>🙏 Welcome to Pandit Booking</h2>
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
              onClick={handleBookingClick}
            >
              <img
                src={
                  service.image ||
                  poojaImageMap[service.name] ||
                  dummyImages[index % dummyImages.length]
                }
                alt={service.name}
                style={styles.cardImage}
              />
              <h3 style={styles.cardTitle}>{service.name}</h3>
              <p style={styles.cardDesc}>{service.description || 'This pooja brings peace and prosperity.'}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

// 📸 Image Map (custom for known poojas)
const poojaImageMap = {
  'Ganesh Puja': 'https://pujabooking.com/wp-content/uploads/2017/07/ganesh-puja.jpg',
  'Satyanarayan Katha': 'https://media.prayagpandits.com/media/2023/05/19161549/Satyanarayan-Pooja.webp',
  'Navagraha Shanti': 'https://kashidham.in/wp-content/uploads/2024/03/navgrah-shanti.jpg',
  'Griha Pravesh': 'https://www.gharjunction.com/img/blog/68.jpg',
  'Rudra Abhishek': 'https://shivology.com/img/article-image-589.jpg',
  'Lakshmi Puja': 'https://resources.mypandit.com/wp-content/uploads/2024/11/Laxmi-Puja_3.webp',
};

// 🧪 Fallback dummy services
const dummyServices = [
  { name: 'Ganesh Puja', description: 'Removes obstacles and ensures success.' },
  { name: 'Satyanarayan Katha', description: 'For prosperity and blessings in life.' },
  { name: 'Navagraha Shanti', description: 'Balances planetary influences.' },
  { name: 'Griha Pravesh', description: 'Performed before entering a new home.' },
  { name: 'Rudra Abhishek', description: 'Puja of Lord Shiva for inner peace.' },
  { name: 'Lakshmi Puja', description: 'Invokes wealth and abundance.' },
];

const dummyImages = [
  'https://pujabooking.com/wp-content/uploads/2017/07/ganesh-puja.jpg',
  'https://media.prayagpandits.com/media/2023/05/19161549/Satyanarayan-Pooja.webp',
  'https://kashidham.in/wp-content/uploads/2024/03/navgrah-shanti.jpg',
  'https://www.gharjunction.com/img/blog/68.jpg',
  'https://shivology.com/img/article-image-589.jpg',
  'https://resources.mypandit.com/wp-content/uploads/2024/11/Laxmi-Puja_3.webp'
];

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Segoe UI, sans-serif',
    background: 'linear-gradient(to bottom right, #f7f0e8, #fff6f1)',
    minHeight: '100vh',
    color: '#333',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#b30059',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    textDecoration: 'none',
    fontWeight: '600',
    color: '#444',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#b30059',
  },
  subtitle: {
    fontSize: '18px',
    color: '#555',
  },
  sectionTitle: {
    fontSize: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    color: '#2e4053',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '15px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
  },
  cardImage: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  cardTitle: {
    marginTop: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#444',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#666',
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


