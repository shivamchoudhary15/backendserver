import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './PanditDashboard.css';

// Dummy ChatWindow for structure – replace with your chat window code
const ChatWindow = ({ userId, panditId, chatName, onClose }) => (
  <div className="chat-window-modal">
    <div className="chat-window-header">
      <span>Chat with {chatName}</span>
      <button onClick={onClose}>×</button>
    </div>
    <div className="chat-window-content">
      <p>[Chat for {panditId}]</p>
      {/* Replace with your chat implementation */}
    </div>
  </div>
);

const pages = {
  dashboard: "Dashboard",
  bookings: "Booking History",
  devotees: "My Devotees",
  chat: "Chats"
};

function PanditDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  // Stats
  const [showStats, setShowStats] = useState(false);
  // Booking filters
  const [filterDate, setFilterDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Chat integration
  const [activeChatDevoteeId, setActiveChatDevoteeId] = useState(null);
  const [activeChatDevoteeName, setActiveChatDevoteeName] = useState('');

  // Fetch bookings on load
  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/bookings/view?panditid=${user._id}`)
        .then(res => res.json())
        .then(setBookings)
        .catch(err => console.error('Error fetching bookings:', err));
    }
  }, [user]);

  // Booking stats by month
  const bookingStatsByMonth = useMemo(() => {
    const months = {};
    bookings.forEach(b => {
      const d = new Date(b.puja_date);
      if (isNaN(d)) return;
      const month = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!months[month]) months[month] = { Accepted:0, Pending:0, Rejected:0, total:0 };
      months[month][b.status] = (months[month][b.status] || 0) + 1;
      months[month].total++;
    });
    return Object.keys(months).sort().map(month => ({ month, ...months[month] }));
  }, [bookings]);

  // Derived stats
  const completedCount = bookings.filter(b => b.status === 'Accepted').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const rejectedCount = bookings.filter(b => b.status === 'Rejected').length;
  const uniqueDevotees = useMemo(() => {
    const ids = new Set();
    bookings.forEach(b => b.userid?._id && ids.add(b.userid._id));
    return ids.size;
  }, [bookings]);
  // Dummy earnings
  const totalEarnings = completedCount * 500;

  // Booking filters
  const filteredBookings = bookings.filter(b => {
    const dateMatch = filterDate ? b.puja_date === filterDate : true;
    const nameMatch = b.userid?.name?.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = filterStatus ? b.status === filterStatus : true;
    return dateMatch && nameMatch && statusMatch;
  });

  // Devotee list
  const devoteesList = useMemo(() => {
    const map = {};
    bookings.forEach(b => {
      if (b.userid?._id && !map[b.userid._id]) {
        map[b.userid._id] = {
          id: b.userid._id,
          name: b.userid.name,
          phone: b.userid.phone,
          city: b.location
        };
      }
    });
    return Object.values(map);
  }, [bookings]);

  // Update status
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/status/${id}`, {
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

  const statusEmoji = { Pending: "⏳", Accepted: "✅", Rejected: "❌" };

  // Sidebar Navigation List
  const sidebarItems = [
    { key:'dashboard', label:'Dashboard', icon: <img src="/images/i2.jpeg" alt="Dashboard" className="sidebar-img-icon" />, emoji:'📊' },
    { key:'bookings', label:'Booking History', icon: <img src="/images/i3.jpeg" alt="Bookings" className="sidebar-img-icon" />, emoji:'📅' },
    { key:'devotees', label:'My Devotees', icon: <img src="/images/i4.jpeg" alt="Devotees" className="sidebar-img-icon" />, emoji:'🙏' },
    { key:'chat', label:'Chats', icon: <img src="/images/i5.jpeg" alt="Chats" className="sidebar-img-icon" />, emoji:'💬' },
  ];

  return (
    <div className="pdash-bg">
      <div className="pdash-overlay" />
      <div className="pandit-main-layout">

        {/* ---- SIDEBAR ---- */}
        <aside className="pandit-sidebar">
          <div className="pandit-profile-sidebar">
            <img
              src="/images/i6.jpeg"
              className="pandit-avatar-lg"
              alt="Pandit Avatar"
              onError={(e)=>{e.target.onerror=null; e.target.style.display='none';}}
            />
            <div className="sidebar-name">
              <span>{user?.name || "Pandit Ji"}</span>
              <small className={user?.is_verified ? "text-verified" : "text-pending"}>
                {user?.is_verified ? "✅ Verified" : "⏳ Not Verified"}
              </small>
            </div>
          </div>
          <nav>
            {sidebarItems.map(item =>
              <div
                key={item.key}
                className={`sidebar-navitem${currentPage === item.key ? ' active' : ''}`}
                onClick={() => setCurrentPage(item.key)}
              >
                {item.icon} <span className="sidebar-item-label">{item.label}</span>
              </div>
            )}
          </nav>
          <button className="logout-btn sidebar-logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </aside>

        {/* ---- MAIN CONTENT ---- */}
        <main className="pandit-content">
          <header className="pandit-header-row2">
            <h1 className="pandit-heading">{pages[currentPage]}</h1>
          </header>

        {/* ------------ DASHBOARD ------------- */}
        {currentPage === "dashboard" && (
          <>
            {/* PROFILE CARD */}
            <div className="pandit-profile-card animate-in">
              <div className="pandit-profile-pic">
                <img
                  src="/images/ho1.png"
                  className="pandit-avatar"
                  alt="Profile"
                  style={{objectFit:'cover'}}
                  onError={e => {e.target.onerror=null; e.target.style.display="none";}}
                />
                <span className={user?.is_verified ? 'pdash-badge verified' : 'pdash-badge notverified'}>
                  {user?.is_verified ?
                    <> <span role="img" aria-label="Verified">✅</span> Verified</>
                    :
                    <> <span role="img" aria-label="Not Verified">⏳</span> Not verified</>
                  }
                </span>
              </div>
              <div className="pandit-profile-info">
                <h2>🙏 {user?.name || 'Pandit Ji'}</h2>
                <p><strong>City:</strong> {user?.city || 'N/A'}</p>
                <p><strong>Experience:</strong> {user?.experienceYears || '--'} years</p>
                <div className="pandit-profile-row">
                  <span><b>📱</b> {user?.phone || 'N/A'}</span>
                  <span><b>🗣</b> {(user?.languages && user.languages.join(', ')) || 'N/A'}</span>
                  <span><b>🌟</b> {user?.speciality || 'Puja & Rituals'}</span>
                </div>
                <button className="stats-toggle-btn" onClick={() => setShowStats(s => !s)} aria-expanded={showStats}>
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

            {/* DASHBOARD CARDS */}
            <div className="pandit-dashboard-cards">
              <div className="dash-card gradientblue">
                <img src="/images/havan.jpeg" className="dash-card-img" alt="Devotees"
                  onError={e=>{e.target.onerror=null; e.target.style.display="none";}} />
                <div className="dash-card-content">
                  <span className="dash-card-label">My Devotees</span>
                  <span className="dash-card-value">{uniqueDevotees}</span>
                </div>
              </div>
              <div className="dash-card gradientmint">
                <img src="/images/ho2.png" className="dash-card-img" alt="Bookings"
                  onError={e=>{e.target.onerror=null; e.target.style.display="none";}} />
                <div className="dash-card-content">
                  <span className="dash-card-label">My Bookings</span>
                  <span className="dash-card-value">{bookings.length}</span>
                </div>
              </div>
              <div className="dash-card gradientyellow">
                <img src="/images/india.jpeg" className="dash-card-img" alt="Chats"
                  onError={e=>{e.target.onerror=null; e.target.style.display="none";}} />
                <div className="dash-card-content">
                  <span className="dash-card-label">Total Chats</span>
                  <span className="dash-card-value">{uniqueDevotees}</span>
                </div>
              </div>
              <div className="dash-card gradientpink">
                <img src="/images/i1.jpeg" className="dash-card-img" alt="Earnings"
                  onError={e=>{e.target.onerror=null; e.target.style.display="none";}} />
                <div className="dash-card-content">
                  <span className="dash-card-label">Earnings</span>
                  <span className="dash-card-value">₹{totalEarnings}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* -------- BOOKINGS HISTORY PAGE --------- */}
        {currentPage === 'bookings' && (
          <>
            <div className="pandit-history-graph-container">
              <h3>📈 Bookings by Month</h3>
              {bookingStatsByMonth.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={bookingStatsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false}/>
                    <Tooltip />
                    <Bar dataKey="Accepted" stackId="a" fill="#66e36c" />
                    <Bar dataKey="Pending" stackId="a" fill="#ffe16a" />
                    <Bar dataKey="Rejected" stackId="a" fill="#ff8567" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-chart">No data to display</div>
              )}
            </div>
            {/* -- Filters -- */}
            <div className="pandit-filters animate-in">
              <input type="date" value={filterDate} className="pandit-input"
                onChange={e => setFilterDate(e.target.value)} />
              <input type="text" placeholder="Search by devotee name" value={searchName}
                onChange={e => setSearchName(e.target.value)} className="pandit-input"/>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="pandit-select">
                <option value="">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <p className="pandit-count animate-in">
              Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
            </p>
            {/* Booking Cards */}
            <div className="pandit-bookings">
              {filteredBookings.length ? filteredBookings.map((b,i) => (
                <div key={b._id} className="pandit-booking-card fade-in" style={{animationDelay:`${0.07*i}s`}}>
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
                    style={{marginTop:10}}
                    onClick={() => { setActiveChatDevoteeId(b.userid?._id); setActiveChatDevoteeName(b.userid?.name || 'Devotee'); }}
                    disabled={!b.userid?._id}
                  >Chat with Devotee</button>
                  {b.status === 'Pending' && (
                    <div className="pandit-buttons">
                      <button onClick={() => updateStatus(b._id, 'Accepted')} className="accept-btn">✅ Accept</button>
                      <button onClick={() => updateStatus(b._id, 'Rejected')} className="reject-btn">❌ Reject</button>
                    </div>
                  )}
                </div>
              )) : (
                <div className="pandit-nobookings">No bookings found.</div>
              )}
            </div>
          </>
        )}

        {/* --------- DEVOTEES PAGE ---------- */}
        {currentPage === "devotees" && (
          <div className="pandit-devotee-list">
            <h3 className="devotee-list-title">✨ My Devotees ({devoteesList.length})</h3>
            {devoteesList.length === 0 ? (
              <div style={{marginTop:24, color:'#888'}}>No devotees found.</div>
            ) : (
              <div className="devotees-table">
                <div className="devotees-table-header">
                  <div>Name</div><div>Phone</div><div>Location</div>
                  <div>Chat</div>
                </div>
                {devoteesList.map(dev =>
                  <div className="devotees-table-row" key={dev.id}>
                    <div>{dev.name}</div>
                    <div>{dev.phone}</div>
                    <div>{dev.city || 'N/A'}</div>
                    <div>
                      <button className="chat-devotee-btn"
                        onClick={() => { setActiveChatDevoteeId(dev.id); setActiveChatDevoteeName(dev.name || "Devotee"); }}>
                        <img src="/images/i2.png" alt="Chat" style={{width:'28px',verticalAlign:'middle'}}
                          onError={e=>{e.target.onerror=null; e.target.style.display="none";}}/>
                        <span style={{marginLeft:5}}>Chat</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* -------- CHAT PAGE --------- */}
        {currentPage === "chat" && (
          <div className="pandit-chat-guide">
            <h3><img src="/images/i1.png" alt="Chat" style={{width:'32px',verticalAlign:'middle',marginRight:5}}
              onError={e=>{e.target.onerror=null; e.target.style.display="none";}}/>
              Start Conversation</h3>
            <p>Select “Chat with Devotee” from Booking History or My Devotees.</p>
            <p>All chat transcripts are shown here (feature coming soon).</p>
          </div>
        )}

        {/* Chat Modal */}
        {activeChatDevoteeId && (
          <ChatWindow
            userId={user?._id}
            panditId={activeChatDevoteeId}
            chatName={activeChatDevoteeName}
            onClose={() => setActiveChatDevoteeId(null)}
          />
        )}

        </main>
      </div>
    </div>
  );
}

export default PanditDashboard;
