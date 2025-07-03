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
  'https://www.google.com/imgres?q=ganesh%20puja&imgurl=https%3A%2F%2Fd18guwlcxyb2ak.cloudfront.net%2Fwp-content%2Fuploads%2F2019%2F12%2F31033604%2FBY-GODS-GANESH-PUJA-600x900.jpg&imgrefurl=https%3A%2F%2Fwww.pujaabhishekam.com%2Fpuja%2Fganesh-puja%3Fsrsltid%3DAfmBOoqB1Xb-uMoQtCE6k_-0Ds4pka911foZo6IGD70Gaf9AlOrNPs8p&docid=gD2Vj46Op-E93M&tbnid=CsdZor1B0pc9sM&vet=12ahUKEwihuqfM_J-OAxU6RWcHHWD7FTYQM3oECBsQAA..i&w=600&h=900&hcb=2&ved=2ahUKEwihuqfM_J-OAxU6RWcHHWD7FTYQM3oECBsQAA',
  'https://www.google.com/imgres?q=Satyanarayan%20Katha&imgurl=https%3A%2F%2Fd18guwlcxyb2ak.cloudfront.net%2Fwp-content%2Fuploads%2F2019%2F03%2F13035054%2FCIty-Varanasi-Satyanarayan-Katha.jpg&imgrefurl=https%3A%2F%2Fwww.pujaabhishekam.com%2Fpuja%2Fsatyanarayan-katha%3Fsrsltid%3DAfmBOopdD4H2lBE1mrkQ__ManbFyTyVruCy7SHxE8uxgd-Su2HZQWDVe&docid=S5olyfX3L0q17M&tbnid=w3KqHp2dcLyFTM&vet=12ahUKEwiRoOfv_J-OAxWkTGwGHfSoE1EQM3oECBwQAA..i&w=1500&h=1091&hcb=2&ved=2ahUKEwiRoOfv_J-OAxWkTGwGHfSoE1EQM3oECBwQAA',
  'https://www.google.com/imgres?q=Navagraha%20Shanti&imgurl=https%3A%2F%2Fkashidham.in%2Fwp-content%2Fuploads%2F2024%2F03%2Fnavgrah-shanti.jpg&imgrefurl=https%3A%2F%2Fkashidham.in%2Fkashidham-seva-kendra%2Fnavgraha-shanti%2F&docid=BnDy0pB0NSJQ9M&tbnid=BeZjfGiCkTeeLM&vet=12ahUKEwiH-ImH_Z-OAxXMcGwGHaq4K0wQM3oECBoQAA..i&w=1000&h=1000&hcb=2&ved=2ahUKEwiH-ImH_Z-OAxXMcGwGHaq4K0wQM3oECBoQAA',
  'https://www.google.com/imgres?q=Griha%20Pravesh&imgurl=https%3A%2F%2Fvideogiri.com%2Fcdn%2Fshop%2Fcollections%2FGriha_Pravesh.webp%3Fv%3D1729749982%26width%3D1296&imgrefurl=https%3A%2F%2Fvideogiri.com%2Fcollections%2Fgriha-pravesh%3Fsrsltid%3DAfmBOoqu1e3WGk67Wzcd5NJnMa3-KfM4MgLOsj_VHVi_mV1NI4EI6YuS&docid=FSKPrMIhnmrHxM&tbnid=Kjh-vGxDfNZFEM&vet=12ahUKEwjtrv6h_Z-OAxUhxzgGHaFDKAEQM3oFCIEBEAA..i&w=1080&h=1080&hcb=2&ved=2ahUKEwjtrv6h_Z-OAxUhxzgGHaFDKAEQM3oFCIEBEAA',
  'https://www.google.com/imgres?q=rudra%20abhishek&imgurl=https%3A%2F%2Fwww.shivaa.org%2Fwp-content%2Fuploads%2F2023%2F10%2Fra.jpeg&imgrefurl=https%3A%2F%2Fwww.shivaa.org%2Fproduct%2Frudra-abhishekam%2F&docid=DzSirk07VU207M&tbnid=ROQvGOFHbIrnMM&vet=12ahUKEwjQ5dy2_Z-OAxXPzjgGHQCKEzUQM3oECBkQAA..i&w=800&h=600&hcb=2&ved=2ahUKEwjQ5dy2_Z-OAxXPzjgGHQCKEzUQM3oECBkQA',
  'https://resources.mypandit.com/wp-content/uploads/2024/11/Laxmi-Puja_3.webp'
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

