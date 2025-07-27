// src/pages/UserProfile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookingsByUser } from '../api/api'; // Assuming you have this API
import './UserProfile.css'; // Create a new CSS file for this page

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUserBookings(parsedUser._id);
    } else {
      navigate('/login'); // Redirect to login if no user data
    }
  }, [navigate]);

  const fetchUserBookings = async (userId) => {
    try {
      setLoading(true);
      const res = await getBookingsByUser(userId); // Use the API to get user-specific bookings
      setUserBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch user bookings:", err);
      setError("Failed to load booking history.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) =>
    ({
      accepted: "status accepted",
      rejected: "status rejected",
      pending: "status pending",
    }[(status || "").toLowerCase()] || "status");

  if (loading) {
    return (
      <div className="user-profile-container loading-state">
        <p>Loading user profile and bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-container error-state">
        <p className="error-message">{error}</p>
        <button onClick={() => navigate('/dashboard')} className="back-to-dashboard-btn">Back to Dashboard</button>
      </div>
    );
  }

  if (!user) {
    return null; // Should ideally redirect to login, handled in useEffect
  }

  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
          {/* Add more user details as available */}
        </div>
        <button className="edit-profile-btn custom-btn glow-btn" onClick={() => alert('Edit profile functionality to be implemented!')}>Edit Profile</button>
      </div>

      <div className="booking-history-card">
        <h3>My Booking History</h3>
        {userBookings.length === 0 ? (
          <p className="empty-msg">You have no past bookings yet.</p>
        ) : (
          <div className="booking-list-grid">
            {userBookings.map(booking => (
              <div key={booking._id} className="booking-item-card">
                <h4>{booking.serviceid?.name || 'Unknown Puja'}</h4>
                <p><strong>Pandit:</strong> {booking.panditid?.name || 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(booking.puja_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.puja_time}</p>
                <p><strong>Location:</strong> {booking.location}</p>
                <div className={getStatusClass(booking.status)}>{booking.status}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button className="back-to-dashboard-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  );
}
