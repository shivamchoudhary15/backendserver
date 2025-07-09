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
    // Fetch services with a slight delay for a smoother initial load animation
    const timer = setTimeout(() => {
      getServices().then((res) => setServices(res.data)).catch((err) => console.error(err));
    }, 300); // Small delay
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

  // Animation variants for different sections
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
        staggerChildren: 0.1, // Stagger animation for individual cards
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
      style={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Login Button Top Right */}
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
        <p style={styles.subtitle}>Book experienced Pandits for your spiritual needs</p>
      </motion.header>

      <section style={{ textAlign: 'center' }}>
        <motion.input
          type="text"
          placeholder="Search for a Pooja..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
          variants={searchInputVariants}
          initial="hidden"
          animate="visible"
          whileFocus={{ scale: 1.02, boxShadow: '0 0 15px rgba(179, 0, 89, 0.2)' }}
        />
      </section>

      <section>
        <h2 style={styles.sectionTitle}>🛕 Popular Hindu Pooja Services</h2>
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
              whileHover={{ scale: 1.05, boxShadow: '0 6px 12px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={service.image || poojaImageMap[service.name] || '/images/default.jpg'}
                alt={service.name}
                style={styles.cardImage}
              />
              <h3 style={styles.cardTitle}>{service.name}</h3>
              <p style={styles.cardDesc}>{service.description || 'This pooja brings spiritual peace and prosperity.'}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section style={styles.actionSection}>
        {!token ? (
          <>
            <h3 style={styles.sectionTitle}>🚀 Get Started</h3>
            <div>
              <Link to="/signup">
                <motion.button
                  style={{ ...styles.button, ...styles.primary }}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Signup as User
                </motion.button>
              </Link>
              <Link to="/signup-pandit">
                <motion.button
                  style={{ ...styles.button, ...styles.secondary }}
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariants}
                >
                  Signup as Pandit
                </motion.button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <h3 style={styles.sectionTitle}>👋 Welcome Back</h3>
            <div>
              <motion.button
                style={{ ...styles.button, ...styles.primary }}
                onClick={() => navigate('/dashboard')}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                Go to Dashboard
              </motion.button>
              <motion.button
                style={{ ...styles.button, ...styles.secondary }}
                onClick={handleBookingClick}
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariants}
              >
                Book a Pooja
              </motion.button>
            </div>
          </>
        )}
      </section>
    </motion.div>
  );
}

const poojaImageMap = {
  'Ganesh Puja': 'https://pujabooking.com/wp-content/uploads/2017/07/ganesh-puja.jpg',
  'Satyanarayan Katha': 'https://media.prayagpandits.com/media/2023/05/19161549/Satyanarayan-Pooja.webp',
  'Navagraha Shanti': 'https://kashidham.in/wp-content/uploads/2024/03/navgrah-shanti.jpg',
  'Griha Pravesh': 'https://www.gharjunction.com/img/blog/68.jpg',
  'Rudra Abhishek': 'https://shivology.com/img/article-image-589.jpg',
  'Lakshmi Puja': 'https://resources.mypandit.com/wp-content/uploads/2024/11/Laxmi-Puja_3.webp',
  // Add more pooja image mappings here as needed
};

const styles = {
  container: {
    padding: '40px',
    fontFamily: "'Inter', sans-serif", // A modern, clean font
    background: 'linear-gradient(to bottom right, #fdf6f0, #ffebe0)', // Softer, warmer gradient
    minHeight: '100vh',
    color: '#333',
    position: 'relative',
    overflowX: 'hidden', // Prevent horizontal scroll on some animations
  },
  loginTopRight: {
    position: 'absolute',
    top: '25px', // Slightly more space
    right: '25px',
    textDecoration: 'none',
    zIndex: 10, // Ensure it's above other elements
  },
  loginBtn: {
    padding: '12px 25px', // Slightly larger button
    backgroundColor: '#007bff', // A more professional blue
    color: '#fff',
    border: 'none',
    borderRadius: '30px', // More rounded for a modern look
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)', // Subtle shadow
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px', // More breathing room
    paddingTop: '20px',
  },
  title: {
    fontSize: '48px', // Larger, more impactful title
    color: '#8a2be2', // A calming, spiritual purple
    fontWeight: '800', // Bolder
    letterSpacing: '-1px', // Tighter letter spacing
    textShadow: '2px 2px 4px rgba(0,0,0,0.05)', // Subtle text shadow
  },
  subtitle: {
    fontSize: '20px',
    color: '#555',
    marginTop: '10px',
    fontStyle: 'italic', // A touch of elegance
  },
  sectionTitle: {
    fontSize: '32px', // Larger section titles
    color: '#4a4a4a', // Darker, richer grey
    marginBottom: '30px', // More space below title
    textAlign: 'center',
    fontWeight: '700',
    position: 'relative', // For underline effect
    paddingBottom: '10px',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Wider cards
    gap: '30px', // More space between cards
    padding: '20px 0',
    maxWidth: '1200px', // Max width for content
    margin: '0 auto', // Center the grid
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '15px', // More rounded corners
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)', // More pronounced but soft shadow
    padding: '20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease', // Smooth transition for hover
    overflow: 'hidden', // Ensure image corners are clipped
  },
  cardImage: {
    width: '100%',
    height: '180px', // Taller images
    objectFit: 'cover',
    borderRadius: '10px', // Rounded image corners
    marginBottom: '15px',
    border: '1px solid #eee', // Subtle border
  },
  cardTitle: {
    marginTop: '10px',
    fontSize: '20px',
    color: '#333',
    fontWeight: '600',
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '15px',
    color: '#777',
    lineHeight: '1.6',
  },
  actionSection: {
    textAlign: 'center',
    marginTop: '70px', // More vertical spacing
    backgroundColor: '#ffffff',
    padding: '40px 20px',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
    maxWidth: '800px',
    margin: '70px auto 0 auto', // Center the section
  },
  button: {
    padding: '14px 30px', // Larger buttons
    fontSize: '17px',
    borderRadius: '30px', // Pill-shaped buttons
    margin: '15px', // More space between buttons
    cursor: 'pointer',
    border: 'none',
    fontWeight: '600',
    transition: 'background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
  },
  primary: {
    backgroundColor: '#8a2be2', // Primary purple
    color: '#fff',
    boxShadow: '0 5px 15px rgba(138, 43, 226, 0.3)',
  },
  secondary: {
    backgroundColor: '#ffc107', // Warm yellow (similar to your previous secondary but slightly bolder)
    color: '#fff', // White text on yellow
    boxShadow: '0 5px 15px rgba(255, 193, 7, 0.3)',
  },
  searchInput: {
    padding: '15px 25px', // Larger padding for better feel
    width: '70%', // Slightly wider
    maxWidth: '600px', // Max width
    fontSize: '17px',
    marginBottom: '40px', // More space below search
    border: '1px solid #ddd',
    borderRadius: '30px', // More rounded
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)', // Subtle shadow
    outline: 'none', // Remove default outline
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
  },
};

export default Home;
