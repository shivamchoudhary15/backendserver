import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PanditDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/bookings/view?panditid=${user._id}`)
        .then(r => r.json())
        .then(setBookings);
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    const res = await fetch(`http://localhost:5000/api/bookings/status/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const j = await res.json();
    setBookings(bs => bs.map(b => (b._id === id ? j.booking : b)));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🧘 Pandit Dashboard</h1>
      <div style={styles.card}>
        <img src={user.profile_photo_url} alt="profile" style={{ width: 80, borderRadius: '50%', float: 'left', marginRight: 20 }} />
        <h2>🙏 {user.name}</h2>
        {/* other details */}
        <p><strong>Verified:</strong> {user.is_verified ? '✅ Yes' : '❌ No'}</p>
      </div>
      <div style={{ margin: '40px auto', maxWidth: 600 }}>
        <h2>Booking Requests</h2>
        {bookings.map(b => (
          <div key={b._id} style={{ border: '1px solid #ccc', padding: 10, margin: '10px 0' }}>
            <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
            <p><strong>Status:</strong> {b.status}</p>
            {b.status === 'Pending' && (
              <>
                <button onClick={() => updateStatus(b._id, 'Accepted')}>✅ Accept</button>
                <button onClick={() => updateStatus(b._id, 'Rejected')}>❌ Reject</button>
              </>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
    </div>
  );
}

export default PanditDashboard;
