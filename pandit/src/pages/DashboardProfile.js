// src/pages/DashboardProfile.js
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getBookingsByUser } from '../api/api'; // Assuming you have this API
import './UserProfile.css'; // Reusing the CSS from the previous UserProfile.js

export default function DashboardProfile() {
  const { user, getStatusClass } = useOutletContext(); // Get user and helper from context
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetchUserBookings(user._id);
    } else {
      setError("User data not available. Please log in.");
      setLoading(false);
    }
  }, [user]); // Depend on user object from context

  const fetchUserBookings = async (userId) => {
    try {
      setLoading(true);
      const res = await getBookingsByUser(userId);
      setUserBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch user bookings:", err);
      setError("Failed to load booking history.");
    } finally {
      setLoading(false);
    }
  };

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
      </div>
    );
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
    </div>
  );
}
