import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getServices } from '../api/api';
import { motion } from 'framer-motion';

// Import your background image. If it's in public folder, you can reference it directly.
// For example, if you put 'spiritual-bg.jpg' in 'public/images/'
const SPIRITUAL_BACKGROUND_IMAGE = '/images/spiritual-bg.jpg';
// Or if you use a direct URL (e.g., from Unsplash or another stock photo site)
// const SPIRITUAL_BACKGROUND_IMAGE = 'https://images.unsplash.com/photo-1549724505-dfb1a3e6a457?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';


function Home() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const timer = setTimeout(() => {
      getServices().then((res) => setServices(res.data)).catch((err) => console.error(err));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleBookingClick = () => {
    if (token) {
      navigate('/booking');
    } else {
      alert('Please log in first to book a service.');
      navigate('/login');
    }
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 10, stiffness: 100 } },
  };

  const searchInputVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { delay: 0.5, duration: 0.5 } },
  };

  const cardGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.7,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 12, stiffness: 100 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      style={styles.containerWrapper} // Use wrapper for background image
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div style={styles.overlay}></div> {/* Overlay for readability */}

      {/* Actual content container */}
      <div style={styles.contentContainer}>
        {!token && (
          <Link to="/login" style={styles.loginTopRight}>
            <motion.button
              style={styles.loginBtn}
              whileHover="hover"
              whileTap="tap"
              variants={buttonVariants}
            >
              Login
            </motion.button>
          </Link>
        )}

        <motion.header style={styles.header} variants={headerVariants}>
          <h1 style={styles.title}>🙏 Welcome to Pandit Booking</h1>
          <p style={styles.subtitle}>Your trusted source for sacred ceremonies</p>
        </motion.header>

        <section style={{ textAlign: 'center' }}>
          <motion.input
            type="text"
            placeholder="Search for a Pooja or ritual..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
            variants={searchInputVariants}
            initial="hidden"
            animate="visible"
            whileFocus={{ scale: 1.02, boxShadow: '0 0 15px rgba(255, 127, 80, 0.3)' }}
          />
        </section>

        <section>
          <h2 style={styles.sectionTitle}>✨ Explore Our Popular Pooja Services</h2>
          <motion.div
            style={styles.cardGrid}
            variants={cardGridVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredServices.map((service) => (
              <motion.div
                key={service._id}
                style={styles.card}
                variants={cardVariants}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={service.image || poojaImageMap[service.name] || '/images/default.jpg'}
                  alt={service.name}
                  style={styles.cardImage}
                  onError={(e) => { e.target.onerror = null; e.target.src="/images/default.jpg" }}
                />
                <h3 style={styles.cardTitle}>{service.name}</h3>
                <p style={styles.cardDesc}>{service.description || 'This sacred pooja is performed for spiritual well-being and prosperity.'}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section style={styles.actionSection}>
          {!token ? (
            <>
              <h3 style={styles.sectionTitle}>🚀 Ready to Get Started?</h3>
              <div>
                <Link to="/signup">
                  <motion.button
                    style={{ ...styles.button, ...styles.primary }}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    Join as Devotee
                  </motion.button>
                </Link>
                <Link to="/signup-pandit">
                  <motion.button
                    style={{ ...styles.button, ...styles.secondary }}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    Register as Pandit
                  </motion.button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h3 style={styles.sectionTitle}>👋 Welcome Back, Devotee!</h3>
              <div>
                <motion.button
                  style={{ ...styles.button, ...styles.primary }}
                  onClick={() => navigate('/dashboard')}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Access Your Dashboard
                </motion.button>
                <motion.button
                  style={{ ...styles.button, ...styles.secondary }}
                  onClick={handleBookingClick}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Book a New Pooja
                </motion.button>
              </div>
            </>
          )}
        </section>
      </div>
    </motion.div>
  );
}

const poojaImageMap = {
  'Ganesh Puja': 'https://sreeganesh.com/wp-content/uploads/2021/04/ganesh_puja.jpg',
  'Satyanarayan Katha': 'https://www.mypandit.com/wp-content/uploads/2023/04/Satyanarayan-Puja-Meaning-Benefits-and-Procedure.jpg',
  'Navagraha Shanti': 'https://kashidham.in/wp-content/uploads/2024/03/navgrah-shanti.jpg',
  'Griha Pravesh': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR08sJ_6k0Z-D4R4T5VbS9wO_i7iM8v5_e-5A&s',
  'Rudra Abhishek': 'https://www.rudrakshaguru.com/wp-content/uploads/2020/09/Rudra-Abhishek-Puja.jpg',
  'Lakshmi Puja': 'https://www.mypandit.com/wp-content/uploads/2023/10/Diwali-Lakshmi-Puja-Muhurat-Significance-and-Vidhi.jpg',
  'Maha Mrityunjaya Jaap': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3iR9Y8j7QW8gO7l7k7t9bH4v4c8z2K-8A&s',
  'Hanuman Puja': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFU_G2_8N4M-2M8p8j_2W4Z7C8K_2m4c7Q-A&s',
  'Vastu Shanti': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvF4B8W2_W7A2G0K_3g5v-4C4L9g2p_4F-7Q&s',
  'Annaprashan Sanskar': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSw1-8P9G8C5m1w8_Q3y0g0g0g0g0g0g0g&s',
};

const styles = {
  containerWrapper: { // This wrapper will hold the background image
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Align content to top
    alignItems: 'center',
    background: `url(${SPIRITUAL_BACKGROUND_IMAGE}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    fontFamily: "'Playfair Display', serif",
    color: '#333', // Default text color for the page
    overflowX: 'hidden',
  },
  overlay: { // Semi-transparent overlay for text readability
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.75)', // White overlay with 75% opacity
    zIndex: 1, // Ensure overlay is behind content but above background image
  },
  contentContainer: { // This will contain all your actual UI elements
    position: 'relative', // Positioned above the overlay
    zIndex: 2, // Ensure content is on top
    width: '100%',
    maxWidth: '1400px', // Max width for overall content
    padding: '40px',
    boxSizing: 'border-box', // Include padding in width calculation
  },
  loginTopRight: {
    position: 'absolute',
    top: '25px',
    right: '25px',
    textDecoration: 'none',
    zIndex: 10,
  },
  loginBtn: {
    padding: '12px 25px',
    backgroundColor: '#FF6347',
    color: '#fff',
    border: 'none',
    borderRadius: '30px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(255, 99, 71, 0.3)',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
    paddingTop: '20px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '52px',
    color: '#6A0572', // Deep purple for title
    fontWeight: 'bold',
    letterSpacing: '-1.5px',
    textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: '20px',
    color: '#5a5a5a',
    marginTop: '15px',
    fontStyle: 'normal',
    lineHeight: '1.5',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '34px',
    color: '#8B4513', // SaddleBrown for section titles
    marginBottom: '35px',
    textAlign: 'center',
    fontWeight: '700',
    position: 'relative',
    paddingBottom: '10px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '30px',
    padding: '20px 0',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    overflow: 'hidden',
    border: '1px solid #f0f0f0',
  },
  cardImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '18px',
    border: '2px solid #FFD700',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontFamily: "'Roboto', sans-serif",
    marginTop: '10px',
    fontSize: '22px',
    color: '#4B0082',
    fontWeight: '700',
    marginBottom: '10px',
  },
  cardDesc: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: '16px',
    color: '#666',
    lineHeight: '1.7',
  },
  actionSection: {
    textAlign: 'center',
    marginTop: '80px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Slightly transparent white for this section
    padding: '50px 20px',
    borderRadius: '20px',
    boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
    maxWidth: '900px',
    margin: '80px auto 0 auto',
  },
  button: {
    padding: '16px 35px',
    fontSize: '18px',
    borderRadius: '35px',
    margin: '18px',
    cursor: 'pointer',
    border: 'none',
    fontWeight: '700',
    letterSpacing: '0.5px',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
  },
  primary: {
    backgroundColor: '#CD5C5C',
    color: '#fff',
    boxShadow: '0 6px 20px rgba(205, 92, 92, 0.4)',
  },
  secondary: {
    backgroundColor: '#FFD700',
    color: '#8B4513',
    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)',
  },
  searchInput: {
    padding: '16px 28px',
    width: '75%',
    maxWidth: '650px',
    fontSize: '18px',
    marginBottom: '45px',
    border: '2px solid #FFB2A2',
    borderRadius: '35px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.08)',
    outline: 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
  },
};

export default Home;
