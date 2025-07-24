import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PanditDashboard.css';
import ChatWindow from './ChatWindow';  // Ensure ChatWindow.js is implemented and imported properly

function PanditDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showStats, setShowStats] = useState(false);

  // Chat integration states
  const [activeChatDevoteeId, setActiveChatDevoteeId] = useState(null);
  const [activeChatDevoteeName, setActiveChatDevoteeName] = useState('');

  const bgStyle = {
    minHeight: '100vh',
    width: '100%',
    background: "url('/images/i3.jpeg') center center / cover no-repeat fixed",
    position: 'relative',
  };

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
      const res = await fetch(`https://backendserver-1-pa6o.onrender.com/api/bookings/status/${id}`, {
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

  const statusEmoji = {
    Pending: "⏳",
    Accepted: "✅",
    Rejected: "❌",
  };

  const completedCount = bookings.filter(b => b.status === 'Accepted').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const rejectedCount = bookings.filter(b => b.status === 'Rejected').length;

  return (
    <div style={bgStyle}>
      <div className="pdash-overlay" />
      <div className="pandit-container">

        {/* Header Row */}
        <div className="pandit-header-row">
          <h1 className="pandit-heading">🧘 Pandit Dashboard</h1>
          <button onClick={handleLogout} className="logout-btn" aria-label="Logout">
            🚪 Logout
          </button>
        </div>

        {/* Profile Card */}
        <div className="pandit-profile-card animate-in">
          <div className="pandit-profile-pic">
            <div className="pandit-avatar" aria-label="Profile Picture" role="img">🧑‍🦳</div>
            <span className={user?.is_verified ? 'pdash-badge verified' : 'pdash-badge notverified'}>
              {user?.is_verified ? <>
                <span role="img" aria-label="Verified">✅</span> Verified
              </> : <>
                <span role="img" aria-label="Not Verified">⏳</span> Not verified
              </>}
            </span>
          </div>
          <div className="pandit-profile-info">
            <h2>🙏 {user?.name || 'Pandit Ji'}</h2>
            <p><strong>City:</strong> {user?.city || 'N/A'}</p>
            <p><strong>Experience:</strong> {user?.experienceYears || '--'} years</p>
            <div className="pandit-profile-row">
              <span><b>📱</b> {user?.phone || 'N/A'}</span>
              <span><b>🗣</b> {(user?.languages && user.languages.join(', ')) || 'N/A'}</span>
            </div>
            <button
              className="stats-toggle-btn"
              onClick={() => setShowStats(s => !s)}
              aria-expanded={showStats}
            >
              {showStats ? 'Hide Stats ▲' : 'Show Stats ▼'}
            </button>
            <div style={{overflow:'hidden'}}>
              <div className={showStats ? "stats-box visible" : "stats-box"}>
                <div className="stats-item">
                  <span className="stats-emoji">✅</span>
                  <span className="stats-num">{completedCount}</span>
                  <span>Accepted</span>
                </div>
                <div className="stats-item">
                  <span className="stats-emoji">⏳</span>
                  <span className="stats-num">{pendingCount}</span>
                  <span>Pending</span>
                </div>
                <div className="stats-item">
                  <span className="stats-emoji">❌</span>
                  <span className="stats-num">{rejectedCount}</span>
                  <span>Rejected</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="pandit-filters animate-in">
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

        <p className="pandit-count animate-in">
          Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
        </p>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="pandit-bookings">
            {filteredBookings.map((b,i) => (
              <div key={b._id} className="pandit-booking-card fade-in" style={{animationDelay: `${0.07*i}s`}}>
                <div className="pandit-booking-head">
                  <span className="booking-devotee">{b.userid?.name || 'N/A'}</span>
                  <span className={`pandit-status ${b.status.toLowerCase()}`}>
                    {statusEmoji[b.status] || ''} {b.status}
                  </span>
                </div>
                <div className="pandit-booking-row">
                  <span>📱 <b>Phone:</b> {b.userid?.phone || 'N/A'}</span>
                  <span>🙏 <b>Service:</b> {b.serviceid?.name || 'N/A'}</span>
                </div>
                <div className="pandit-booking-row">
                  <span>🛕 <b>Pooja:</b> {b.poojaId?.name || 'N/A'}</span>
                  <span>📅 <b>Date:</b> {new Date(b.puja_date).toDateString()}</span>
                  <span>⏰ <b>Time:</b> {b.puja_time}</span>
                </div>
                <div className="pandit-booking-row">
                  <span>📍 <b>Location:</b> {b.location || 'N/A'}</span>
                </div>

                {/* Chat with Devotee Button */}
                <button
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setActiveChatDevoteeId(b.userid?._id);
                    setActiveChatDevoteeName(b.userid?.name || 'Devotee');
                  }}
                  disabled={!b.userid?._id}
                >
                  Chat with Devotee
                </button>

                {b.status === 'Pending' && (
                  <div className="pandit-buttons">
                    <button onClick={() => updateStatus(b._id, 'Accepted')} className="accept-btn">✅ Accept</button>
                    <button onClick={() => updateStatus(b._id, 'Rejected')} className="reject-btn">❌ Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="pandit-nobookings fade-in">No bookings found.</div>
        )}

        {/* Chat Window */}
        {activeChatDevoteeId && (
          <ChatWindow
            userId={user?._id}
            panditId={activeChatDevoteeId}
            chatName={activeChatDevoteeName}
            onClose={() => setActiveChatDevoteeId(null)}
          />
        )}

      </div>
    </div>
  );
}

export default PanditDashboard;
