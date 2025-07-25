import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, CalendarCheck2, Users, MessageCircle, IndianRupee, Phone, ShieldCheck,
  Timer, XCircle, Star, ArrowRight, Clock3, LogOut, UserCircle2
} from "lucide-react";
import './PanditDashboard.css';

// Dummy ChatWindow for structure
const ChatWindow = ({ userId, panditId, chatName, onClose }) => (
  <div className="chat-window-modal" role="dialog" aria-modal="true">
    <div className="chat-window-header">
      <span>Chat with {chatName}</span>
      <button onClick={onClose} aria-label="Close chat window">×</button>
    </div>
    <div className="chat-window-content">
      <p>[Chat for {panditId}]</p>
      {/* Actual chat integration goes here */}
    </div>
  </div>
);

const pages = {
  dashboard: "Dashboard",
  bookings: "Bookings",
  devotees: "Devotees",
  chat: "Chats"
};

function PanditDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showStats, setShowStats] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [activeChatDevoteeId, setActiveChatDevoteeId] = useState(null);
  const [activeChatDevoteeName, setActiveChatDevoteeName] = useState('');

  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/bookings/view?panditid=${user._id}`)
        .then(res => res.json())
        .then(setBookings)
        .catch(() => {});
    }
  }, [user]);

  // Stats by month for charts
  const bookingStatsByMonth = useMemo(() => {
    const months = {};
    bookings.forEach(b => {
      const d = new Date(b.puja_date);
      if (isNaN(d)) return;
      const month = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!months[month]) months[month] = { Accepted: 0, Pending: 0, Rejected: 0, total: 0 };
      months[month][b.status] = (months[month][b.status] || 0) + 1;
      months[month].total++;
    });
    return Object.keys(months).sort().map(month => ({ month, ...months[month] }));
  }, [bookings]);

  const completedCount = bookings.filter(b => b.status === 'Accepted').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const rejectedCount = bookings.filter(b => b.status === 'Rejected').length;
  const uniqueDevotees = useMemo(() => {
    const ids = new Set();
    bookings.forEach(b => b.userid?._id && ids.add(b.userid._id));
    return ids.size;
  }, [bookings]);
  const totalEarnings = completedCount * 500;

  const filteredBookings = bookings.filter(b => {
    const dateMatch = filterDate ? b.puja_date === filterDate : true;
    const nameMatch = b.userid?.name?.toLowerCase().includes(searchName.toLowerCase());
    const statusMatch = filterStatus ? b.status === filterStatus : true;
    return dateMatch && nameMatch && statusMatch;
  });

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

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setBookings(prev => prev.map(b => (b._id === id ? data.booking : b)));
    } catch (err) {}
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Status icon mapping
  const statusIcon = {
    Pending: <Timer size={16} color="#e5ae28" />,
    Accepted: <ShieldCheck size={16} color="#23cb7d" />,
    Rejected: <XCircle size={16} color="#e15d7c" />,
  };

  // Sidebar items with Lucide icons
  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <Home size={22} /> },
    { key: 'bookings', label: 'Bookings', icon: <CalendarCheck2 size={22} /> },
    { key: 'devotees', label: 'Devotees', icon: <Users size={22} /> },
    { key: 'chat', label: 'Chats', icon: <MessageCircle size={22} /> },
  ];

  // Top services widget
  const topServices = useMemo(() => {
    const stats = {};
    bookings.forEach(b => {
      const svc = b.serviceid?.name;
      if (svc) stats[svc] = (stats[svc] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 2);
  }, [bookings]);

  // Upcoming pujas widget
  const upcoming = useMemo(() => {
    return bookings
    .filter(b =>
      new Date(b.puja_date) >= new Date(Date.now() - 24*60*60*1000)
      && b.status === "Accepted"
    ).sort((a, b) => new Date(a.puja_date) - new Date(b.puja_date)).slice(0, 3);
  }, [bookings]);
  
  return (
    <div className="pdash-bg">
      <div className="pandit-main-layout">
        {/* Sidebar */}
        <aside className="pandit-sidebar">
          <div className="pandit-profile-sidebar">
            <img
              src="/logo.png"
              className="pandit-logo"
              alt="App Logo"
              style={{ width: 44, height: 44, borderRadius: 10, marginBottom: 8 }}
            />
            <div className="sidebar-name">
              <span>{user?.name || "Pandit Ji"}</span>
              <small className={user?.is_verified ? "text-verified" : "text-pending"}>
                {user?.is_verified ? <><ShieldCheck size={12} color="#23cb7d" style={{marginBottom:-2}} /> Verified</> : <><Timer size={12} color="#e5ae28" style={{marginBottom:-2}}/> Not Verified</>}
              </small>
            </div>
          </div>
          <nav role="navigation">
            {sidebarItems.map(item =>
              <div
                key={item.key}
                className={`sidebar-navitem${currentPage === item.key ? ' active' : ''}`}
                onClick={() => setCurrentPage(item.key)}
                tabIndex={0}
                aria-label={item.label}
              >
                {item.icon}
                <span className="sidebar-item-label">{item.label}</span>
              </div>
            )}
          </nav>
          <button className="logout-btn sidebar-logout-btn" onClick={handleLogout}><LogOut size={20} style={{marginRight:5}} /> Logout</button>
        </aside>

        {/* Main Content */}
        <main className="pandit-content">
          <header className="pandit-header-row2">
            <h1 className="pandit-heading">{pages[currentPage]}</h1>
          </header>

          {/* Dashboard */}
          {currentPage === "dashboard" && (
            <>
              {/* Profile Card */}
              <div className="pandit-profile-card animate-in">
                <div className="pandit-profile-pic">
                  <UserCircle2 color="#9ddbfa" size={104} className="pandit-avatar" />
                  <span className={user?.is_verified ? 'pdash-badge verified' : 'pdash-badge notverified'}>
                    {user?.is_verified
                      ? <><ShieldCheck size={16} /> Verified</>
                      : <><Timer size={16} /> Not verified</>
                    }
                  </span>
                </div>
                <div className="pandit-profile-info">
                  <h2>🙏 {user?.name || 'Pandit Ji'}</h2>
                  <p><strong>City:</strong> {user?.city || 'N/A'}</p>
                  <p><strong>Experience:</strong> {user?.experienceYears || '--'} years</p>
                  <div className="pandit-profile-row">
                    <span><Phone style={{marginRight:2}} size={16} /> {user?.phone || 'N/A'}</span>
                    <span><b>🗣</b> {(user?.languages && user.languages.join(', ')) || 'N/A'}</span>
                    <span><Star style={{marginBottom:-3}} size={16}/> {user?.speciality || 'Puja & Rituals'}</span>
                  </div>
                  <button className="stats-toggle-btn" onClick={() => setShowStats(s => !s)} aria-expanded={showStats}>
                    {showStats ? 'Hide Stats ▲' : 'Show Stats ▼'}
                  </button>
                  <div style={{overflow: 'hidden'}}>
                    <div className={showStats ? "stats-box visible" : "stats-box"}>
                      <div className="stats-item">
                        <ShieldCheck size={22} color="#2ec977" />
                        <span className="stats-num">{completedCount}</span>
                        <span>Accepted</span>
                      </div>
                      <div className="stats-item">
                        <Timer size={22} color="#e5ae28" />
                        <span className="stats-num">{pendingCount}</span>
                        <span>Pending</span>
                      </div>
                      <div className="stats-item">
                        <XCircle size={22} color="#e15d7c" />
                        <span className="stats-num">{rejectedCount}</span>
                        <span>Rejected</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dashboard Cards */}
              <div className="pandit-dashboard-cards">
                <div className="dash-card gradientblue">
                  <Users size={32} color="#245898" className="dash-card-icon"/>
                  <div>
                    <span className="dash-card-label">Devotees</span>
                    <span className="dash-card-value">{uniqueDevotees}</span>
                  </div>
                </div>
                <div className="dash-card gradientmint">
                  <CalendarCheck2 size={32} color="#2ecc71" className="dash-card-icon"/>
                  <div>
                    <span className="dash-card-label">Bookings</span>
                    <span className="dash-card-value">{bookings.length}</span>
                  </div>
                </div>
                <div className="dash-card gradientyellow">
                  <MessageCircle size={32} color="#ad920d" className="dash-card-icon"/>
                  <div>
                    <span className="dash-card-label">Chats</span>
                    <span className="dash-card-value">{uniqueDevotees}</span>
                  </div>
                </div>
                <div className="dash-card gradientpink">
                  <IndianRupee size={32} color="#e15d7c" className="dash-card-icon"/>
                  <div>
                    <span className="dash-card-label">Earnings</span>
                    <span className="dash-card-value">₹{totalEarnings}</span>
                  </div>
                </div>
              </div>

              {/* Extra Widgets */}
              <div className="dashboard-widgets">
                <div className="widget upcoming-pujas">
                  <h3><Clock3 size={20} /> Upcoming Pujas</h3>
                  {upcoming.length === 0 ? (
                    <p>No upcoming pujas.</p>
                  ) : (
                    <ul>
                      {upcoming.map(b =>
                        <li key={b._id}><ArrowRight size={13} /> {b.pujaId?.name || "Puja"} – {new Date(b.puja_date).toLocaleDateString()}</li>
                      )}
                    </ul>
                  )}
                </div>
                <div className="widget top-services">
                  <h3><Star size={20} /> Top Services</h3>
                  {topServices.length === 0 ? <p>N/A</p> :
                    <ul>
                      {topServices.map(([svc, count]) =>
                        <li key={svc}>{svc}: {count}</li>
                      )}
                    </ul>
                  }
                </div>
              </div>
            </>
          )}

          {/* Bookings Page */}
          {currentPage === 'bookings' && (
            <>
              <div className="pandit-filters animate-in">
                <input type="date" value={filterDate} className="pandit-input"
                  onChange={e => setFilterDate(e.target.value)} aria-label="Filter by date"/>
                <input type="text" placeholder="Search by devotee name" value={searchName}
                  onChange={e => setSearchName(e.target.value)} className="pandit-input" aria-label="Search by devotee"/>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="pandit-select" aria-label="Filter by status">
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
                {filteredBookings.length ? filteredBookings.map((b, i) => (
                  <div key={b._id} className="pandit-booking-card fade-in" style={{ animationDelay: `${0.07 * i}s` }}>
                    <div className="pandit-booking-head">
                      <span className="booking-devotee">{b.userid?.name || 'N/A'}</span>
                      <span className={`pandit-status ${b.status.toLowerCase()}`}>
                        {statusIcon[b.status]} {b.status}
                      </span>
                    </div>
                    <div className="pandit-booking-row">
                      <span><Phone size={14} /> {b.userid?.phone || 'N/A'}</span>
                      <span><Users size={14} /> {b.serviceid?.name || 'N/A'}</span>
                    </div>
                    <div className="pandit-booking-row">
                      <span>🛕 <b>Puja:</b> {b.pujaId?.name || 'N/A'}</span>
                      <span>📅 <b>Date:</b> {new Date(b.puja_date).toDateString()}</span>
                      <span>⏰ <b>Time:</b> {b.puja_time}</span>
                    </div>
                    <div className="pandit-booking-row">
                      <span>📍 <b>Location:</b> {b.location || 'N/A'}</span>
                    </div>
                    <button
                      style={{ marginTop: 10 }}
                      onClick={() => { setActiveChatDevoteeId(b.userid?._id); setActiveChatDevoteeName(b.userid?.name || 'Devotee'); }}
                      disabled={!b.userid?._id}
                    >Chat with Devotee</button>
                    {b.status === 'Pending' && (
                      <div className="pandit-buttons">
                        <button onClick={() => updateStatus(b._id, 'Accepted')} className="accept-btn"><ShieldCheck size={14} /> Accept</button>
                        <button onClick={() => updateStatus(b._id, 'Rejected')} className="reject-btn"><XCircle size={14} /> Reject</button>
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="pandit-nobookings">No bookings found.</div>
                )}
              </div>
            </>
          )}

          {/* Devotees Page */}
          {currentPage === "devotees" && (
            <div className="pandit-devotee-list">
              <h3 className="devotee-list-title">✨ My Devotees ({devoteesList.length})</h3>
              {devoteesList.length === 0 ? (
                <div style={{ marginTop: 24, color: '#888' }}>No devotees found.</div>
              ) : (
                <div className="devotees-table" role="table">
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
                          <MessageCircle size={20} style={{ marginRight: 5 }} />
                          Chat
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Chat Page */}
          {currentPage === "chat" && (
            <div className="pandit-chat-guide">
              <h3><MessageCircle size={28} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                Start Conversation</h3>
              <p>Select “Chat with Devotee” from Bookings or Devotees.</p>
              <p>All chat transcripts will appear here. (Feature Coming Soon)</p>
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
