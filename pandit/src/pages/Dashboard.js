import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview, getBookings } from '../api/api';

function Dashboard() {
  // existing code ...
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?._id) {
      getBookings(user._id).then(res => setBookings(res.data));
    }
  }, [user]);

  return (
    // existing markup...
    {bookings.length > 0 && (
      <div>
        <h3>Your Bookings</h3>
        {bookings.map(b => (
          <div key={b._id} style={{ border: '1px solid #ccc', padding: 10, margin: 10 }}>
            <p><strong>Pandit:</strong> {b.panditid.name}</p>
            <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
            <p><strong>Status:</strong> {b.status}</p>
          </div>
        ))}
      </div>
    )}
  );
}

export default Dashboard;
