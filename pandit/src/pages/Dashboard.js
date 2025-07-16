import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings, getVerifiedPandits } from '../api/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const bookingsRef = useRef(null);
  const reviewsRef = useRef(null);

  const [user, setUser] = useState(null);
  const [review, setReview] = useState({ name: '', rating: '', comment: '' });
  const [reviewMessage, setReviewMessage] = useState('');
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [pandits, setPandits] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) return navigate('/login');

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'admin') return navigate('/admin');
      if (parsedUser.role === 'pandit') return navigate('/pandit/dashboard');

      setUser(parsedUser);
      setReview(prev => ({ ...prev, name: parsedUser.name }));

      getBookings({ userid: parsedUser._id }).then(res => setBookings(res.data));
      getVerifiedPandits().then(res => setPandits(res.data));
    } catch (err) {
      console.error('User parse error:', err);
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/home');
  };

  const handleBookingRedirect = () => navigate('/booking');
  const scrollToBookings = () => bookingsRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToReviews = () => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const ratingValue = Number(review.rating);
    if (!review.name || !review.comment || isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      setReviewMessage('Please fill all fields with a rating between 1 and 5.');
      return;
    }

    try {
      await createReview(review);
      setReviewMessage('Review submitted!');
      setReview({ name: review.name, rating: '', comment: '' });
    } catch {
      setReviewMessage('Failed to submit review.');
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Accepted') return 'status accepted';
    if (status === 'Rejected') return 'status rejected';
    return 'status pending';
  };

  const filteredBookings = bookings.filter(b => {
    const query = search.toLowerCase();
    return (
      (b.panditid?.name?.toLowerCase().includes(query) ||
        b.serviceid?.name?.toLowerCase().includes(query) ||
        new Date(b.puja_date).toLocaleDateString().includes(query))
    );
  });

  const filteredPandits = pandits.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2>Shubhkarya</h2>
        <button onClick={scrollToBookings}>Bookings</button>
        <button onClick={scrollToReviews}>Reviews</button>
        <button onClick={handleBookingRedirect}>Book a Service</button>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </aside>

      <main className="main-content">
        {user && (
          <div className="welcome-section">
            <h2>Welcome, {user.name}</h2>
            <p>Explore spiritual guidance, book pujas, and connect with verified pandits across India.</p>
          </div>
        )}

        {/* Updated Highlight Cards */}
        <section className="highlight-section">
          <div
            className="highlight-card"
            style={{ backgroundImage: "url('/images/india.jpeg')" }}
          >
            <div className="highlight-content">
              <h4>Spiritual Guides</h4>
              <p>Pandits & Consultants across India</p>
              <p>4000+ Experts</p>
            </div>
          </div>

          <div
            className="highlight-card"
            style={{ backgroundImage: "url('/images/kalash.jpeg')" }}
          >
            <div className="highlight-content">
              <h4>Various services</h4>
              <p>Wide variety of spiritual services</p>
              <p>500+ pujas</p>
            </div>
          </div>

          <div
            className="highlight-card"
            style={{ backgroundImage: "url('/images/havan.jpeg')" }}
          >
            <div className="highlight-content">
              <h4>Pujas Done</h4>
              <p>Performed by verified pandits</p>
              <p>1,00,000+ Completed</p>
            </div>
          </div>
        </section>

        {/* Verified Pandits */}
        <section className="pandit-section">
          <h3>Verified Pandits</h3>
          <input
            type="text"
            className="booking-search"
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="pandit-list">
            {filteredPandits.slice(0, visibleCount).map(p => (
              <div className="pandit-card" key={p._id}>
                <img src={p.profile_photo_url || '/images/default.jpg'} alt={p.name} />
                <h4>{p.name}</h4>
                <p><strong>City:</strong> {p.city}</p>
                <p><strong>Experience:</strong> {p.experienceYears} yrs</p>
                <p><strong>Languages:</strong> {p.languages?.join(', ')}</p>
                <p><strong>Specialties:</strong> {p.specialties?.join(', ')}</p>
              </div>
            ))}
          </div>
          {filteredPandits.length > 3 && (
            <div className="toggle-btn">
              <button
                onClick={() => setVisibleCount(prev => prev === 3 ? filteredPandits.length : 3)}
                className="custom-btn"
              >
                {visibleCount === 3 ? 'Show More' : 'Show Less'}
              </button>
            </div>
          )}
        </section>

        {/* Bookings Section */}
        <section ref={bookingsRef} className="bookings-section">
          <h3>Your Bookings</h3>
          <div className="booking-list">
            {filteredBookings.length === 0 ? (
              <p>No matching bookings found.</p>
            ) : (
              filteredBookings.map(b => (
                <div key={b._id} className="booking-card">
                  <p><strong>Service:</strong> {b.serviceid?.name || b.serviceid}</p>
                  <p><strong>Pandit:</strong> {b.panditid?.name || 'N/A'}</p>
                  <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
                  <p><strong>Time:</strong> {b.puja_time}</p>
                  <p><strong>Location:</strong> {b.location}</p>
                  <p><strong>Status:</strong> <span className={getStatusClass(b.status)}>{b.status}</span></p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Review Section */}
        <section ref={reviewsRef} className="review-section">
          <h3>Submit a Review</h3>
          {reviewMessage && (
            <p className={reviewMessage.includes('submitted') ? 'success-message' : 'error-message'}>{reviewMessage}</p>
          )}
          <form onSubmit={handleReviewSubmit} className="review-form">
            <input type="text" value={review.name} disabled />
            <input
              type="number"
              placeholder="Rating (1-5)"
              value={review.rating}
              onChange={e => setReview(prev => ({ ...prev, rating: e.target.value }))}
              min="1"
              max="5"
              required
            />
            <textarea
              placeholder="Write your feedback..."
              value={review.comment}
              onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
              required
            />
            <button type="submit" className="custom-btn">Submit Review</button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
