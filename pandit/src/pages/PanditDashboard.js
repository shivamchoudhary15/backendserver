import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanditDashboard.css'; // Import the CSS file

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

  // Dynamic profile photo; fallback to public folder image
  const profilePhoto = user?.profile_photo_url
    ? user.profile_photo_url.startsWith('/uploads')
      ? `https://backendserver-pf4h.onrender.com${user.profile_photo_url}`
      : user.profile_photo_url
    : '/images/i1.jpeg';

  return (
    <div className="pandit-container">
      <h1 className="pandit-heading">🧘 Pandit Dashboard</h1>

      <div className="pandit-card">
        <img
          src={profilePhoto}
          alt="Pandit Profile"
          className="pandit-avatar"
          onError={e => { e.target.onerror = null; e.target.src = '/images/i2.jpeg'; }}
        />
        <div>
          <h2>🙏 {user?.name || 'Pandit Ji'}</h2>
          <p>
            <strong>Verified: </strong>
            {user?.is_verified
              ? <img src="/images/i3.jpeg" alt="Verified" className="pandit-icon-ver" />
              : <img src="/images/i4.jpeg" alt="Not Verified" className="pandit-icon-ver" />}
          </p>
        </div>
      </div>

      <div className="pandit-filters">
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="pandit-input"
        />
        <input
          type="text"
          placeholder="Search by devotee name"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="pandit-input"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="pandit-select"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <p className="pandit-count">
        Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
      </p>

      {filteredBookings.length > 0 ? (
        <div className="pandit-bookings">
          {filteredBookings.map(b => (
            <div key={b._id} className="pandit-booking-card">
              <p><strong>Devotee:</strong> {b.userid?.name || 'N/A'}</p>
              <p><strong>Phone:</strong> {b.userid?.phone || 'N/A'}</p>
              <p><strong>Service:</strong> {b.serviceid?.name || 'N/A'}</p>
              <p><strong>Pooja:</strong> {b.poojaId?.name || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(b.puja_date).toDateString()}</p>
              <p><strong>Time:</strong> {b.puja_time}</p>
              <p><strong>Location:</strong> {b.location || 'N/A'}</p>
              <p>
                <strong>Status:</strong>
                <span className={`pandit-status ${b.status.toLowerCase()}`}>{b.status}</span>
              </p>
              {b.status === 'Pending' && (
                <div className="pandit-buttons">
                  <button onClick={() => updateStatus(b._id, 'Accepted')} className="accept-btn">
                    <img src="/images/i5.jpeg" alt="Accept" className="pandit-icon-btn" />Accept
                  </button>
                  <button onClick={() => updateStatus(b._id, 'Rejected')} className="reject-btn">
                    <img src="/images/i6.jpeg" alt="Reject" className="pandit-icon-btn" />Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="pandit-nobookings">No bookings found.</p>
      )}

      <div className="pandit-actions">
        <button onClick={handleLogout} className="logout-btn">
          <img src="/images/i7.jpeg" alt="Logout" className="pandit-icon-btn" />Logout
        </button>
      </div>
    </div>
  );
}

export default PanditDashboard;
