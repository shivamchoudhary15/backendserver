import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PanditDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetch(`https://backendserver-dryq.onrender.com/api/bookings/view?panditid=${user._id}`)
        .then(res => res.json())
        .then(setBookings)
        .catch(err => console.error('Error fetching bookings:', err));
    }
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`https://backendserver-dryq.onrender.com/api/bookings/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setBookings(prev => prev.map(b => (b._id === id ? data.booking : b)));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const filteredBookings = bookings.filter(b => {
    const dateMatch = filterDate ? b.puja_date === filterDate : true;
    const nameMatch = b.userid?.name?.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = filterStatus ? b.status.toLowerCase() === filterStatus.toLowerCase() : true;
    return dateMatch && nameMatch && statusMatch;
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🧘 Pandit Dashboard</h1>

      <div style={styles.card}>
        <img
          src={
            user?.profile_photo_url
              ? user.profile_photo_url.startsWith('/uploads')
                ? `https://backendserver-pf4h.onrender.com${user.profile_photo_url}`
                : user.profile_photo_url
              : '/images/default-pandit.png'
          }
          alt="profile"
          style={styles.avatar}
        />
        <div>
          <h2>🙏 {user?.name || 'Pandit Ji'}</h2>
          <p><strong>Verified:</strong> {user?.is_verified ? '✅ Yes' : '❌ No'}</p>
        </div>
      </div>

      <div style={styles.filters}>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by devotee name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <p style={styles.countText}>
        Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
      </p>

      {filteredBookings.length > 0 ? (
        <div style={{ marginTop: 30 }}>
          {filteredBookings.map(b => (
            <div key={b._id} style={styles.bookingCard}>
              <p><strong>Devotee:</strong> {b.userid?.name || 'N/A'}</p>
              <p><strong>Phone:</strong> {b.userid?.phone || 'N/A'}</p>
              <p><strong>Service:</strong> {b.serviceid?.name || 'N/A'}</p>
              <p><strong>Pooja:</strong> {b.poojaId?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
              <p><strong>Time:</strong> {b.puja_time}</p>
              <p><strong>Location:</strong> {b.location || 'N/A'}</p>
              <p>
                <strong>Status:</strong>
                <span style={{ ...styles.status, ...styles[b.status.toLowerCase()] }}>
                  {b.status}
                </span>
              </p>

              {b.status === 'Pending' && (
                <div style={styles.buttonGroup}>
                  <button onClick={() => updateStatus(b._id, 'Accepted')} style={styles.acceptBtn}>✅ Accept</button>
                  <button onClick={() => updateStatus(b._id, 'Rejected')} style={styles.rejectBtn}>❌ Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', marginTop: 40 }}>No bookings found.</p>
      )}

      <div style={styles.actions}>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    fontSize: '32px',
    marginBottom: '30px',
    color: '#2c3e50',
  },
  avatar: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: '50%',
    marginRight: 20,
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: 'auto',
    lineHeight: '1.8',
  },
  filters: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '40px',
    flexWrap: 'wrap',
  },
  countText: {
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
    color: '#555',
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '20px',
    margin: '20px auto',
    maxWidth: '600px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  buttonGroup: {
    marginTop: '10px',
    display: 'flex',
    gap: '10px',
  },
  acceptBtn: {
    backgroundColor: '#2ecc71',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  rejectBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  actions: {
    textAlign: 'center',
    marginTop: '40px',
  },
  logoutBtn: {
    padding: '12px 24px',
    backgroundColor: '#e67e22',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  status: {
    marginLeft: 10,
    padding: '4px 10px',
    borderRadius: '8px',
    fontWeight: 'bold',
  },
  pending: {
    backgroundColor: '#f1c40f',
    color: '#fff',
  },
  accepted: {
    backgroundColor: '#2ecc71',
    color: '#fff',
  },
  rejected: {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
};

export default PanditDashboard;
