// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const dummyImages = [
  'https://pujabooking.com/wp-content/uploads/2017/07/ganesh-puja.jpg',
  'https://media.prayagpandits.com/media/2023/05/19161549/Satyanarayan-Pooja.webp',
  'https://kashidham.in/wp-content/uploads/2024/03/navgrah-shanti.jpg',
  'https://www.gharjunction.com/img/blog/68.jpg',
  'https://shivology.com/img/article-image-589.jpg',
  'https://resources.mypandit.com/wp-content/uploads/2024/11/Laxmi-Puja_3.webp',
];

const Home = () => {
  const [services, setServices] = useState([]);
  const [pandits, setPandits] = useState([]);
  const [poojas, setPoojas] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('https://backendserver-6-yebf.onrender.com/api/pandits/view')
      .then(res => res.json())
      .then(data => setPandits(data));

    fetch('https://backendserver-6-yebf.onrender.com/api/poojas/view')
      .then(res => res.json())
      .then(data => setPoojas(data));

    fetch('https://backendserver-6-yebf.onrender.com/api/services/view')
      .then(res => res.json())
      .then(data => setServices(data));
  }, []);

  const handleBooking = () => {
    token ? navigate('/booking') : (alert('Please login'), navigate('/login'));
  };

  return (
    <div className="home-container">
      {/* Navbar, Hero and About sections same as before */}

      {/* Services Section */}
      <section id="services" className="services">
        <h2>Pooja Provided</h2>
        <div className="card-grid">
          {poojas.map((pooja, idx) => (
            <div className="service-card" key={idx} onClick={() => setSelectedService(pooja)}>
              <img src={pooja.imageUrl || dummyImages[idx % dummyImages.length]} alt={pooja.name} />
              <h3>{pooja.name}</h3>
            </div>
          ))}
        </div>
        {selectedService && (
          <div className="service-description">
            <h3>{selectedService.name}</h3>
            <p>{selectedService.description}</p>
            <button onClick={() => setSelectedService(null)}>Close</button>
          </div>
        )}
      </section>

      {/* Pandits Section */}
      <section id="pandits" className="pandits">
        <h2>Meet Our Pandits</h2>
        <div className="pandit-grid">
          {pandits.map((p, idx) => (
            <div className="pandit-card" key={idx}>
              <img src={p.profile_photo_url} alt={p.name} />
              <h4>{p.name}</h4>
              <p>{p.city} | {p.experienceYears}+ yrs exp</p>
              <p>🗣 {p.languages?.join(', ')}</p>
              <p>🎯 {p.specialties?.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer remains same */}
    </div>
  );
};

export default Home;
