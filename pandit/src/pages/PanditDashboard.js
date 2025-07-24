import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBarChart2, FiList, FiPieChart, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { Pie } from "react-chartjs-2";
import './PanditDashboard.css';

// Dummy ChatWindow import for completeness; implement as needed
// import ChatWindow from './ChatWindow';

function PanditDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeChatDevoteeId, setActiveChatDevoteeId] = useState(null);
  const [activeChatDevoteeName, setActiveChatDevoteeName] = useState('');
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    if (user?._id) {
      fetch(`https://backendserver-1-pa6o.onrender.com/api/bookings/view?panditid=${user._id}`)
        .then(res => res.json())
        .then(data => setBookings(data))
        .catch(console.error);

      fetch(`https://backendserver-1-pa6o.onrender.com/api/bookings/history?panditid=${user._id}`)
        .then(res => res.json())
        .then(setHistory)
        .catch(console.error);
    }
  }, [user]);

  const handleLogout = () => { localStorage.clear(); navigate('/'); };

  // Stats for dashboard summary
  const accepted = bookings.filter(b => b.status === 'Accepted').length;
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const rejected = bookings.filter(b => b.status === 'Rejected').length;

  // Pie Chart Data for Booking History
  const chartData = {
    labels: ['Accepted', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          history.filter(h => h.status === 'Accepted').length,
          history.filter(h => h.status === 'Pending').length,
          history.filter(h => h.status === 'Rejected').length
        ],
        backgroundColor: ['#4bcf9b', '#ffe666', '#ec6e6e'],
        borderWidth: 1,
      }
    ]
  };

  // Sidebar Navigation
  const sidebarItems = [
    { key: 'dashboard', label: "Dashboard", icon: <FiBarChart2 /> },
    { key: 'history', label: "Booking History", icon: <FiPieChart /> },
    { key: 'bookings', label: "All Bookings", icon: <FiList /> },
  ];

  // Main content panel
  function renderContent() {
    if (activePage === 'dashboard') {
      return (
        <div>
          <div className="pandit-profile-card">
            <div className="pandit-profile-pic">
              <img src="/images/profile-avatar.png" alt="Pandit" className="pandit-avatar-img" />
              <span className={user?.is_verified ? 'pdash-badge verified' : 'pdash-badge notverified'}>
                {user?.is_verified ? '✅ Verified' : '⏳ Not Verified'}
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
              <div className="stats-box visible">
                  <div className="stats-item">
                    <span className="stats-emoji">✅</span>
                    <span className="stats-num">{accepted}</span>
                    <span>Accepted</span>
                  </div>
                  <div className="stats-item">
                    <span className="stats-emoji">⏳</span>
                    <span className="stats-num">{pending}</span>
                    <span>Pending</span>
                  </div>
                  <div className="stats-item">
                    <span className="stats-emoji">❌</span>
                    <span className="stats-num">{rejected}</span>
                    <span>Rejected</span>
                  </div>
              </div>
            </div>
          </div>
          <div className="dashboard-chart-area" style={{maxWidth:340, margin: '29px auto 0'}}>
            <Pie data={chartData} />
            <div className="pie-label">Booking History Pie Chart</div>
          </div>
        </div>
      );
    }
    if (activePage === 'history') {
      return (
        <div>
          <h2 className="dashboard-title">All Past Bookings</h2>
          <div className="dashboard-history-list">
            {history.length ? history.map((b, i) => (
              <div key={b._id || i} className="history-card">
                <div className="history-row">
                  <span><b>Devotee:</b> {b.userid?.name}</span>
                  <span className={`history-status ${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
                <div className="history-row">
                  <span><b>Puja:</b> {b.poojaId?.name || '-'}</span>
                  <span><b>Service:</b> {b.serviceid?.name}</span>
                  <span><b>Date:</b> {new Date(b.puja_date).toLocaleDateString()}</span>
                  <span><b>Time:</b> {b.puja_time}</span>
                </div>
                <div className="history-row">
                  <span><b>Location:</b> {b.location}</span>
                </div>
              </div>
            )) : <div className="empty-msg">No history data yet.</div>}
          </div>
        </div>
      );
    }
    if (activePage === 'bookings') {
      return (
        <div>
          <h2 className="dashboard-title">Current Bookings</h2>
          <div className="pandit-bookings">
            {bookings.length === 0 && <div className="pandit-nobookings">No bookings found.</div>}
            {bookings.map((b,i) => (
              <div key={b._id} className="pandit-booking-card fade-in" style={{animationDelay: `${0.07*i}s`}}>
                <div className="pandit-booking-head">
                  <span className="booking-devotee">{b.userid?.name || 'N/A'}</span>
                  <span className={`pandit-status ${b.status.toLowerCase()}`}>{b.status}</span>
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
                {/* Implement ChatWindow for chat */}
                {/* <button
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setActiveChatDevoteeId(b.userid?._id);
                    setActiveChatDevoteeName(b.userid?.name || 'Devotee');
                  }}
                  disabled={!b.userid?._id}
                >
                  Chat with Devotee
                </button> */}
                {b.status === 'Pending' && (
                  <div className="pandit-buttons">
                    <button onClick={() => updateStatus(b._id, 'Accepted')} className="accept-btn">✅ Accept</button>
                    <button onClick={() => updateStatus(b._id, 'Rejected')} className="reject-btn">❌ Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  }

  // Only used if you want to update status on current bookings
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
      alert('Error updating booking status');
    }
  };

  return (
    <div className="dash-wrap" style={{
      background: "url('/images/i3.jpeg') center center / cover no-repeat fixed",
      minHeight:"100vh"
    }}>
      <div className="pdash-overlay" />

      {/* SIDEBAR */}
      <aside
        className={`dashboard-sidebar${sidebarOpen ? ' open' : ''}`}
        onMouseEnter={() => setSidebarOpen(true)}
        onMouseLeave={() => setSidebarOpen(false)}
      >
        <div className="sidebar-brand">
          <img src="/images/subh.png" alt="Logo" style={{ width: 38, borderRadius: 10, marginRight: 8 }} />
          <span className="brand-text">ShubhKarya</span>
          <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(s => !s)} aria-label="Menu">
            {sidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
        <ul className="sidebar-nav">
          {sidebarItems.map(item => (
            <li
              key={item.key}
              className={activePage === item.key ? 'active' : ''}
              onClick={() => setActivePage(item.key)}
            >
              {item.icon}
              <span className="nav-label">{item.label}</span>
            </li>
          ))}
        </ul>
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <FiLogOut />
          <span className="nav-label">Logout</span>
        </button>
      </aside>

      {/* MAIN */}
      <main className="pandit-container dash-main">
        <div className="pandit-header-row">
          <img src="/images/shubhkarya-header.png" alt="Banner" style={{ height: 48, marginRight: 12, borderRadius: 9, boxShadow:"0 1px 8px #ebf4fa"}} />
          <h1 className="pandit-heading">🧘 Pandit Dashboard</h1>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}

export default PanditDashboard;
