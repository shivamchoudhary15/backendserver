import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './Dashboard.css';

const DEFAULT_POOJAS = [
  { id: 'p1', name: 'Ganesh Puja', img: '/images/ganesh.jpeg', popular: true },
  { id: 'p2', name: 'Navgrah Shanti', img: '/images/kalash.jpeg', popular: true },
  { id: 'p3', name: 'Satyanarayan Puja', img: '/images/havan.jpeg', popular: true },
  { id: 'p4', name: 'Rudrabhishek', img: '/images/i2.jpeg', popular: false },
  { id: 'p5', name: 'Griha Pravesh', img: '/images/i1.jpeg', popular: false }
];
const FAKE_PANDITS = [
  { _id: 'a1', name: 'Pt. Ram Sharma', city: 'Delhi', rating: 4.8, totalPooja: 98, experienceYears: 15, languages: ['Hindi', 'Sanskrit'], specialties: ['Ganesh Puja', 'Navgrah Shanti'], profile_photo_url: '/images/pandit1.jpg' },
  { _id: 'a2', name: 'Pt. Suresh Joshi', city: 'Mumbai', rating: 4.9, totalPooja: 124, experienceYears: 21, languages: ['Marathi', 'Hindi'], specialties: ['Satyanarayan Puja', 'Rudrabhishek'], profile_photo_url: '/images/pandit2.jpg' },
  { _id: 'a3', name: 'Pt. Ramesh Iyer', city: 'Chennai', rating: 4.6, totalPooja: 80, experienceYears: 11, languages: ['Tamil', 'English'], specialties: ['Satyanarayan Puja'], profile_photo_url: '/images/pandit3.jpg' },
  // Duplicate for demo!
  { _id: 'a4', name: 'Pt. Ram Sharma', city: 'Delhi', rating: 4.8, totalPooja: 98, experienceYears: 15, languages: ['Hindi', 'Sanskrit'], specialties: ['Ganesh Puja', 'Navgrah Shanti'], profile_photo_url: '/images/pandit1.jpg' },
  { _id: 'a5', name: 'Pt. Sunil Pathak', city: 'Bhopal', rating: 4.2, totalPooja: 43, experienceYears: 7, languages: ['Hindi'], specialties: ['Griha Pravesh'], profile_photo_url: '/images/pandit4.jpg' },
];
const FAKE_BOOKINGS = [
  { _id: 1, serviceid: { name: 'Ganesh Puja' }, puja_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), puja_time: '10:00 AM', panditid: { name: 'Pt. Ram Sharma' }, location: 'Delhi', status: 'Accepted' },
  { _id: 2, serviceid: { name: 'Navgrah Shanti' }, puja_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), puja_time: '08:00 AM', panditid: { name: 'Pt. Suresh Joshi' }, location: 'Mumbai', status: 'Pending' },
  { _id: 3, serviceid: { name: 'Satyanarayan Puja' }, puja_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), puja_time: '11:30 AM', panditid: { name: 'Pt. Ram Sharma' }, location: 'Delhi', status: 'Rejected' },
  { _id: 4, serviceid: { name: 'Griha Pravesh' }, puja_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), puja_time: '09:00 AM', panditid: { name: 'Pt. Sunil Pathak' }, location: 'Bhopal', status: 'Accepted' },
  { _id: 5, serviceid: { name: 'Ganesh Puja' }, puja_date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), puja_time: '12:00 PM', panditid: { name: 'Pt. Suresh Joshi' }, location: 'Mumbai', status: 'Accepted' }
];

// You can use react-router-dom's useNavigate in your main app!
function Dashboard() {
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [user, setUser] = useState({ name: 'Harsh Mishra', email: 'harsh@email.com', phone: '9711xxxx11' }); // demo
  const [review, setReview] = useState({ name: 'Harsh Mishra', rating: '', comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [bookings] = useState([...FAKE_BOOKINGS]);
  const [pandits] = useState([...FAKE_PANDITS]);
  const [searchPandit, setSearchPandit] = useState({ q: '', city: '', rating: 0, totalPooja: 0 });
  const [selectedPandit, setSelectedPandit] = useState(null);
  const [showPopularPooja, setShowPopularPooja] = useState(false);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [historyFilter, setHistoryFilter] = useState('all');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [adIndex, setAdIndex] = useState(0);

  // Popular pooja carousel: cycle every 3s
  useEffect(() => {
    const i = setInterval(() => setCarouselIndex(idx => (idx + 1) % DEFAULT_POOJAS.length), 3500);
    return () => clearInterval(i);
  }, []);

  // Simple ad slider demo
  useEffect(() => {
    const i = setInterval(() => setAdIndex(idx => (idx + 1) % 3), 3500);
    return () => clearInterval(i);
  }, []);

  // Pandit filter function
  const filteredPandits = pandits.filter(p =>
    (!searchPandit.q || p.name.toLowerCase().includes(searchPandit.q.toLowerCase())) &&
    (!searchPandit.city || p.city.toLowerCase().includes(searchPandit.city.toLowerCase())) &&
    (!searchPandit.rating || +p.rating >= +searchPandit.rating) &&
    (!searchPandit.totalPooja || +p.totalPooja >= +searchPandit.totalPooja)
  );

  // Booking history filter
  const now = Date.now();
  const filteredBookings = bookings.filter(b => {
    if (historyFilter === 'week') {
      return now - new Date(b.puja_date).getTime() < (7 * 24 * 60 * 60 * 1000);
    }
    if (historyFilter === 'month') {
      return now - new Date(b.puja_date).getTime() < (30 * 24 * 60 * 60 * 1000);
    }
    return true;
  });

  // Navbar options
  const NAV_LINKS = [
    { icon: '👤', label: 'Profile', onClick: () => setProfileModal(true) },
    { icon: '📿', label: 'View Pandits', onClick: () => { setSelectedPandit(null); setShowPopularPooja(false); } },
    { icon: '🔥', label: 'Popular Poojas', onClick: () => setShowPopularPooja(true) },
    { icon: '📅', label: 'Booking History', onClick: () => window.scrollTo(0, document.getElementById('history-section').offsetTop) },
    { icon: '⭐', label: 'My Ratings', onClick: () => window.scrollTo(0, document.getElementById('review-section').offsetTop) },
    { icon: '🚪', label: 'Logout', onClick: () => alert('Logout (stubbed)') }
  ];

  // Handlers for booking etc.
  const handleBookNow = () => {
    alert(`Redirecting to booking page with:\nPandit: ${selectedPandit.name}\nPooja: ${selectedPooja?.name || ''}\n\n(Auto-filled).`);
    // Implement routing/booking logic as needed.
  };

  return (
    <div className="dashboard-root">

      {/* MODALS */}
      {profileModal && (
        <div className="modal-bg" onClick={() => setProfileModal(false)}>
          <div className="profile-modal" onClick={e => e.stopPropagation()}>
            <h3>Update Profile</h3>
            <label>Name:
              <input value={user.name} onChange={e => setUser(u => ({ ...u, name: e.target.value }))} />
            </label>
            <label>Email:
              <input value={user.email} onChange={e => setUser(u => ({ ...u, email: e.target.value }))} />
            </label>
            <label>Phone:
              <input value={user.phone} onChange={e => setUser(u => ({ ...u, phone: e.target.value }))} />
            </label>
            <button onClick={() => setProfileModal(false)} className="custom-btn">Save</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav
        className={`v-navbar${isNavbarOpen ? ' open' : ''}`}
        onMouseEnter={() => setNavbarOpen(true)}
        onMouseLeave={() => setNavbarOpen(false)}
      >
        <div className="v-navbar-mini" onClick={() => setNavbarOpen(v=>!v)}>
          <img src="/images/profile.png" alt="Profile" className="v-navbar-avatar" />
          <span>☰</span>
        </div>
        <AnimatePresence>
          {isNavbarOpen && (
            <motion.ul className="v-navbar-full"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 210, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.19 }}
            >
              {NAV_LINKS.map(link => (
                <li key={link.label} onClick={link.onClick} className="v-navbar-item">
                  <span className="v-navbar-icon">{link.icon}</span> {link.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </nav>

      {/* ADS/CAROUSELS */}
      <div className="ad-slider">
        {[ // example content, can expand per design
          <span key="ad1">🎁 &nbsp; <b>SHUBH50</b> Use for ₹50 OFF on your first Puja! </span>,
          <span key="ad2">🌟 Top-rated Pandits Online Now – Book Instantly!</span>,
          <span key="ad3">🔥 Recently booked: Ganesh Puja by Pt. Ram Sharma</span>
        ][adIndex]}
      </div>

      {/* WELCOME */}
      <div className="welcome-banner nice-glass" data-aos="fade">
        <h2>Welcome, <span>{user.name}</span>!</h2>
        <p>May your every puja bring joy and prosperity.</p>
      </div>

      {/* PANDITS & BOOKING FLOW */}
      <section className="main-content">
      {/* Pandit BROWSE and search */}
      {!showPopularPooja && (
        <section id="pandit-section" className="pandit-section" data-aos="fade-up">
          <div className="section-heading">View Our Pandits</div>
          <div className="pandit-search-row">
            <input placeholder="Name..." value={searchPandit.q} onChange={e=>setSearchPandit({...searchPandit, q: e.target.value})} />
            <input placeholder="City..." value={searchPandit.city} onChange={e=>setSearchPandit({...searchPandit, city: e.target.value})} />
            <input placeholder="Min rating" type="number" min={0} max={5} value={searchPandit.rating} onChange={e=>setSearchPandit({...searchPandit, rating: e.target.value})} />
            <input placeholder="Total Pooja" type="number" min={0} value={searchPandit.totalPooja} onChange={e=>setSearchPandit({...searchPandit, totalPooja: e.target.value})} />
          </div>
          <div className="pandit-list">
            {filteredPandits.length === 0 ? <p>No matching pandits found.</p> : filteredPandits.slice(0, 5).map(p => (
              <div key={p._id}
                className={`pandit-card improved-pandit-card neon-card glass-highlight glossy shadow-pop`}
                onClick={() => {setSelectedPandit(p); setShowPopularPooja(true); setSelectedPooja(null);} }>
                <img src={p.profile_photo_url||"/images/i1.jpeg"} alt={p.name} className="pandit-avatar glass" />
                <div>
                  <div className="pandit-name">{p.name}</div>
                  <div className="pandit-city">City: {p.city} </div>
                  <div>⭐ {p.rating} | Poojas: {p.totalPooja}</div>
                  <div className="pandit-badges">
                    <span className="pandit-badge exp">{p.experienceYears} yrs exp</span>
                    <span className="pandit-badge langs">{p.languages.join(', ')}</span>
                  </div>
                  <div className="pandit-specialties"><b>Specialties:</b> {p.specialties.join(', ')}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* POPULAR POOJA SLIDER + Booking */}
      {showPopularPooja && selectedPandit && (
        <section className="pooja-carousel-section" data-aos="fade-up">
          <h3>Choose a Pooja to Book with <b>{selectedPandit.name}</b></h3>
          <div className="pooja-slider">
            {DEFAULT_POOJAS.map((pooja,idx)=>(
              <div key={pooja.id}
                className={'pooja-slide' + (carouselIndex===idx ? ' active':'')}
                style={{backgroundImage:`url(${pooja.img})`}}
                onClick={() => setSelectedPooja(pooja)}
              >
                <div className="pooja-name">{pooja.name}</div>
                {pooja.popular && <span className="pooja-badge">Popular</span>}
              </div>
            ))}
          </div>
          {selectedPooja && (
            <div style={{margin:'1.2em 0'}}>
              <button className="custom-btn glow-btn" onClick={handleBookNow}>
                Book Now: {selectedPooja.name}
              </button>
              <button className="custom-btn" style={{marginLeft:8}} onClick={()=>alert('You are now Shisya (stub)')}>
                Become His Shisya
              </button>
              <button className="custom-btn" style={{marginLeft:8, background:'gray', color:'white'}} onClick={()=> {setShowPopularPooja(false); setSelectedPandit(null); setSelectedPooja(null);}}>
                Back
              </button>
            </div>
          )}
        </section>
      )}
      </section>

      {/* BOOKING HISTORY */}
      <section id="history-section" className="bookings-section blur-bg" data-aos="fade-up">
        <h3 className="section-heading">Your Bookings</h3>
        <div className="history-filters">
          <button onClick={()=>setHistoryFilter('all')} className={historyFilter==='all'?'active-filter':''}>All</button>
          <button onClick={()=>setHistoryFilter('month')} className={historyFilter==='month'?'active-filter':''}>Past 1 Month</button>
          <button onClick={()=>setHistoryFilter('week')} className={historyFilter==='week'?'active-filter':''}>Past 1 Week</button>
        </div>
        <div className="booking-list">
          {filteredBookings.length === 0 ? <p className="empty-msg">No matching bookings found.</p> :
            filteredBookings.map(b => (
            <div key={b._id}
              className="booking-card card-glossy glass neon-card shadow-pop"
            >
              <div className="booking-card-left">
                <span className="booking-icon">📅</span>
                <div>
                  <div className="booking-type">{b.serviceid?.name}</div>
                  <div className="booking-date">{new Date(b.puja_date).toLocaleDateString()} at {b.puja_time}</div>
                </div>
              </div>
              <div className="booking-card-right">
                <div className="booking-pandit">
                  <span className="booking-pandit-label">Pandit:</span> <span>{b.panditid?.name}</span>
                </div>
                <div className="booking-location">📍 {b.location}</div>
                <div className={`booking-status ${b.status === 'Accepted'
                  ? 'accepted' : b.status === 'Rejected'
                  ? 'rejected' : 'pending'}`}>
                  {b.status}
                </div>
              </div>
            </div>
            ))}
        </div>
      </section>
      {/* RATINGS: Just reviews area */}
      <section id="review-section" className="review-section glass-review" data-aos="fade-up">
        <h3 className="section-heading neon-text">Submit a Review</h3>
        {reviewMessage && (
          <p className={reviewMessage.includes('submitted') ? 'success-message' : 'error-message'}>{reviewMessage}</p>
        )}
        <form onSubmit={e=>{e.preventDefault(); setReviewMessage('Review submitted! (demo)'); setTimeout(()=>setReviewMessage(''),1200);}} className="review-form card-glossy glass nice-glass">
          <div className="review-row">
            <input type="text" value={review.name} disabled className="review-input" />
            <input type="number" className="review-input review-rating" placeholder="Rating (1-5) ⭐"
              value={review.rating} onChange={e => setReview(prev => ({ ...prev, rating: e.target.value }))}
              min="1" max="5" required />
          </div>
          <textarea
            placeholder="Write your feedback..."
            value={review.comment}
            onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
            className="review-input review-textarea"
            required
          />
          <button type="submit" className="custom-btn glow-btn">Submit Review 💬</button>
        </form>
      </section>
    </div>
  )
}

export default Dashboard;
