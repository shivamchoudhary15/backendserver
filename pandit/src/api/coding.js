import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, CalendarCheck2, Users, MessageCircle, IndianRupee, Phone, ShieldCheck,
  Timer, XCircle, Star, ArrowRight, Clock3, LogOut, UserCircle2
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import './PanditDashboard.css';

// ChatWindow Modal (You can expand this later as per your chat feature)
const ChatWindow = ({ userId, panditId, chatName, onClose }) => (
  <motion.div
    className="chat-window-modal"
    role="dialog"
    aria-modal="true"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="chat-window-content-wrapper"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      style={{ background: '#fff', borderRadius: 14, maxWidth: 480, width: '95%', boxShadow: '0 9px 28px rgba(0,0,0,0.15)' }}
    >
      <div className="chat-window-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', backgroundColor: '#1979c5', borderRadius: '14px 14px 0 0', color: 'white' }}>
        <span>Chat with {chatName}</span>
        <button onClick={onClose} aria-label="Close chat window" style={{ fontSize: 22, border: 'none', background: 'transparent', cursor: 'pointer', color: 'white' }}>×</button>
      </div>
      <div className="chat-window-content" style={{ padding: 20, minHeight: 180 }}>
        {/* TODO: Implement actual chat here */}
        <p style={{ fontStyle: 'italic', color: '#556779' }}>[Chat for panditId: {panditId}] - Feature Coming Soon</p>
      </div>
    </motion.div>
  </motion.div>
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
  const [filterResetTrigger, setFilterResetTrigger] = useState(0);

  // Fetch bookings whenever user ID changes
  useEffect(() => {
    if (user?._id) {
      fetch(`http://localhost:5000/api/bookings/view?panditid=${user._id}`)
        .then(res => res.json())
        .then(data => setBookings(data))
        .catch(() => setBookings([]));
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

  // Filters for bookings with reset function
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const dateMatch = filterDate ? b.puja_date === filterDate : true;
      const nameMatch = b.userid?.name?.toLowerCase().includes(searchName.toLowerCase());
      const statusMatch = filterStatus ? b.status === filterStatus : true;
      return dateMatch && nameMatch && statusMatch;
    });
  }, [bookings, filterDate, searchName, filterStatus, filterResetTrigger]);

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

  // Update status of a booking on server and local state
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if(data.booking) {
        setBookings(prev => prev.map(b => (b._id === id ? data.booking : b)));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Status icons mapping
  const statusIcon = {
    Pending: <Timer size={18} color="#e5ae28" />,
    Accepted: <ShieldCheck size={18} color="#23cb7d" />,
    Rejected: <XCircle size={18} color="#e15d7c" />,
  };

  // Sidebar items with icons
  const sidebarItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <Home size={24} /> },
    { key: 'bookings', label: 'Bookings', icon: <CalendarCheck2 size={24} /> },
    { key: 'devotees', label: 'Devotees', icon: <Users size={24} /> },
    { key: 'chat', label: 'Chats', icon: <MessageCircle size={24} /> },
  ];

  // Top services widget
  const topServices = useMemo(() => {
    const stats = {};
    bookings.forEach(b => {
      const svc = b.serviceid?.name;
      if (svc) stats[svc] = (stats[svc] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 3);
  }, [bookings]);

  // Upcoming pujas widget
  const upcoming = useMemo(() => {
    return bookings
      .filter(b =>
        new Date(b.puja_date) >= new Date(Date.now() - 24 * 60 * 60 * 1000)
        && b.status === "Accepted"
      )
      .sort((a, b) => new Date(a.puja_date) - new Date(b.puja_date))
      .slice(0, 5);
  }, [bookings]);

  // Clear filters helper
  const clearFilters = () => {
    setFilterDate('');
    setSearchName('');
    setFilterStatus('');
    setFilterResetTrigger(t => t + 1); // force recalculation
  };

  return (
    <div className="pdash-bg">
      <div className="pandit-main-layout">

        {/* Sidebar */}
        <aside className="pandit-sidebar" aria-label="Pandit dashboard navigation">
          <div className="pandit-profile-sidebar">
            <img
              src="/images/subh.png"
              alt="App Logo"
              className="pandit-logo"
            />
            <div className="sidebar-name" tabIndex={-1}>
              {user?.name || "Pandit Ji"}
              <small className={user?.is_verified ? "text-verified" : "text-pending"}>
                {user?.is_verified ? (
                  <>
                    <ShieldCheck size={14} /> Verified
                  </>
                ) : (
                  <>
                    <Timer size={14} /> Not Verified
                  </>
                )}
              </small>
            </div>
          </div>

          <nav role="navigation" aria-label="Main dashboard pages">
            {sidebarItems.map(item => (
              <div
                key={item.key}
                className={`sidebar-navitem${currentPage === item.key ? ' active' : ''}`}
                onClick={() => setCurrentPage(item.key)}
                tabIndex={0}
                role="button"
                aria-current={currentPage === item.key ? "page" : undefined}
                aria-label={item.label}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setCurrentPage(item.key); }}
              >
                {item.icon}
                <span className="sidebar-item-label">{item.label}</span>
              </div>
            ))}
          </nav>

          <button
            className="logout-btn sidebar-logout-btn"
            onClick={handleLogout}
            aria-label="Logout from dashboard"
            type="button"
          >
            <LogOut size={22} /> Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="pandit-content">
          <header className="pandit-header-row2" aria-live="polite">
            <h1 className="pandit-heading">{pages[currentPage]}</h1>
          </header>

          {/* Dashboard Page */}
          {currentPage === 'dashboard' && (
            <>
              <motion.div
                className="pandit-profile-card animate-in"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="pandit-profile-pic" aria-label="Pandit profile picture and status">
                  <UserCircle2 color="#9ddbfa" size={108} className="pandit-avatar" aria-hidden="true" />
                  <span
                    className={user?.is_verified ? 'pdash-badge verified' : 'pdash-badge notverified'}
                    aria-live="polite"
                  >
                    {user?.is_verified ? <><ShieldCheck size={18} /> Verified</> : <><Timer size={18} /> Not Verified</>}
                  </span>
                </div>
                <div className="pandit-profile-info">
                  <h2 tabIndex={-1}>🙏 {user?.name || 'Pandit Ji'}</h2>
                  <p><strong>City:</strong> {user?.city || 'N/A'}</p>
                  <p><strong>Experience:</strong> {user?.experienceYears || '--'} years</p>
                  <div className="pandit-profile-row">
                    <span><Phone style={{ marginRight: 4 }} size={18} /> {user?.phone || 'N/A'}</span>
                    <span><b>🗣</b> {(user?.languages && user.languages.join(', ')) || 'N/A'}</span>
                    <span><Star style={{ marginBottom: -3 }} size={18} /> {user?.speciality || 'Puja & Rituals'}</span>
                  </div>
                  <button
                    className="stats-toggle-btn"
                    onClick={() => setShowStats(s => !s)}
                    aria-expanded={showStats}
                    aria-controls="stats-section"
                  >
                    {showStats ? 'Hide Stats ▲' : 'Show Stats ▼'}
                  </button>
                  <motion.div
                    id="stats-section"
                    style={{ overflow: 'hidden' }}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: showStats ? 'auto' : 0, opacity: showStats ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    aria-live="polite"
                  >
                    <div className="stats-box" style={{ gap: 26 }}>
                      <div className="stats-item" aria-label={`Accepted bookings: ${completedCount}`}>
                        <ShieldCheck size={26} color="#2ec977" aria-hidden="true" />
                        <span className="stats-num">{completedCount}</span>
                        <span>Accepted</span>
                      </div>
                      <div className="stats-item" aria-label={`Pending bookings: ${pendingCount}`}>
                        <Timer size={26} color="#e5ae28" aria-hidden="true" />
                        <span className="stats-num">{pendingCount}</span>
                        <span>Pending</span>
                      </div>
                      <div className="stats-item" aria-label={`Rejected bookings: ${rejectedCount}`}>
                        <XCircle size={26} color="#e15d7c" aria-hidden="true" />
                        <span className="stats-num">{rejectedCount}</span>
                        <span>Rejected</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Dashboard Cards */}
              <motion.div
                className="pandit-dashboard-cards"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="dash-card gradientblue" aria-label={`Devotees: ${uniqueDevotees}`}>
                  <Users size={32} color="#245898" className="dash-card-icon" aria-hidden="true" />
                  <div>
                    <span className="dash-card-label">Devotees</span>
                    <span className="dash-card-value">{uniqueDevotees}</span>
                  </div>
                </div>
                <div className="dash-card gradientmint" aria-label={`Bookings: ${bookings.length}`}>
                  <CalendarCheck2 size={32} color="#2ecc71" className="dash-card-icon" aria-hidden="true" />
                  <div>
                    <span className="dash-card-label">Bookings</span>
                    <span className="dash-card-value">{bookings.length}</span>
                  </div>
                </div>
                <div className="dash-card gradientyellow" aria-label={`Chats: ${uniqueDevotees}`}>
                  <MessageCircle size={32} color="#ad920d" className="dash-card-icon" aria-hidden="true" />
                  <div>
                    <span className="dash-card-label">Chats</span>
                    <span className="dash-card-value">{uniqueDevotees}</span>
                  </div>
                </div>
                <div className="dash-card gradientpink" aria-label={`Earnings: ₹${totalEarnings}`}>
                  <IndianRupee size={32} color="#e15d7c" className="dash-card-icon" aria-hidden="true" />
                  <div>
                    <span className="dash-card-label">Earnings</span>
                    <span className="dash-card-value">₹{totalEarnings}</span>
                  </div>
                </div>
              </motion.div>

              {/* Extra Widgets */}
              <div className="dashboard-widgets" role="region" aria-label="Dashboard extra widgets">

                {/* Upcoming pujas widget */}
                <div className="widget upcoming-pujas" tabIndex={-1}>
                  <h3><Clock3 size={22} aria-hidden="true" style={{ marginRight: 6 }} /> Upcoming Pujas</h3>
                  {upcoming.length === 0 ? (
                    <p>No upcoming pujas.</p>
                  ) : (
                    <ul>
                      {upcoming.map(b => {
                        // Color code tag based on how soon
                        const daysDiff = Math.ceil((new Date(b.puja_date) - new Date()) / (1000 * 60 * 60 * 24));
                        let tag = '';
                        let tagColor = '';
                        if (daysDiff < 1) { tag = 'Today'; tagColor = '#178f36'; } 
                        else if (daysDiff === 1) { tag = 'Tomorrow'; tagColor = '#e5ae28'; }
                        else { tag = `In ${daysDiff} days`; tagColor = '#26415a'; }
                        return (
                          <li key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span><ArrowRight size={14} /> {b.pujaId?.name || "Puja"} – {new Date(b.puja_date).toLocaleDateString()}</span>
                            <span style={{ backgroundColor: tagColor, color: 'white', borderRadius: 12, padding: '2px 10px', fontWeight: '700', fontSize: '0.86em' }} aria-label={`Date tag: ${tag}`}>{tag}</span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Top services widget */}
                <div className="widget top-services" tabIndex={-1}>
                  <h3><Star size={22} aria-hidden="true" style={{ marginRight: 6 }} /> Top Services</h3>
                  {topServices.length === 0 ? <p>N/A</p> :
                    <ul>
                      {topServices.map(([svc, count]) => (
                        <li key={svc}>{svc}: {count}</li>
                      ))}
                    </ul>
                  }
                </div>

                {/* Offers banner example */}
                <div className="offer-banner" tabIndex={-1} aria-live="polite">
                  <span role="alert" aria-atomic="true">🎉 This Shravan: 25% Off on Rudrabhishek Pujas! Book Now </span>
                  {/* The button could link to offers page */}
                  <button type="button" onClick={() => alert('Offer details coming soon!')}>See Details</button>
                </div>

              </div>
            </>
          )}

          {/* Bookings Page */}
          {currentPage === 'bookings' && (
            <>
              <motion.div
                className="pandit-filters animate-in"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
              >
                <input
                  type="date"
                  value={filterDate}
                  className="pandit-input"
                  onChange={e => setFilterDate(e.target.value)}
                  aria-label="Filter bookings by date"
                />
                <input
                  type="text"
                  placeholder="Search by devotee name"
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  className="pandit-input"
                  aria-label="Search bookings by devotee name"
                />
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="pandit-select"
                  aria-label="Filter bookings by status"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  style={{ backgroundColor: '#ff7f7f', color: '#fff', borderRadius: 8, padding: '9px 14px', fontWeight: 700, marginLeft: 12, border: 'none', userSelect: 'none', cursor: 'pointer' }}
                  onClick={clearFilters}
                  aria-label="Clear all filters"
                  type="button"
                >
                  Clear Filters
                </button>
              </motion.div>
              <p className="pandit-count" aria-live="polite" aria-atomic="true">
                Showing {filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}
              </p>

              {/* Bookings List */}
              <div className="pandit-bookings" role="list" aria-label="Filtered bookings list">
                <AnimatePresence>
                  {filteredBookings.length ? filteredBookings.map((b, i) => (
                    <motion.div
                      key={b._id}
                      className={`pandit-booking-card ${b.status.toLowerCase()}`}
                      role="listitem"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ delay: 0.07 * i }}
                      tabIndex={0}
                      aria-describedby={`booking-desc-${b._id}`}
                    >
                      <div className="pandit-booking-head">
                        <span className="booking-devotee">{b.userid?.name || 'N/A'}</span>
                        <span className={`pandit-status ${b.status.toLowerCase()}`}>
                          {statusIcon[b.status]} {b.status}
                        </span>
                      </div>
                      <div className="pandit-booking-row" id={`booking-desc-${b._id}`}>
                        <span><Phone size={16} /> {b.userid?.phone || 'N/A'}</span>
                        <span><Users size={16} /> {b.serviceid?.name || 'N/A'}</span>
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
                        style={{ marginTop: 14 }}
                        onClick={() => { setActiveChatDevoteeId(b.userid?._id); setActiveChatDevoteeName(b.userid?.name || 'Devotee'); }}
                        disabled={!b.userid?._id}
                        aria-label={`Chat with devotee ${b.userid?.name || 'Devotee'}`}
                        type="button"
                      >
                        Chat with Devotee
                      </button>
                      {b.status === 'Pending' && (
                        <div className="pandit-buttons" aria-label="Action buttons for pending booking">
                          <button
                            onClick={() => updateStatus(b._id, 'Accepted')}
                            className="accept-btn"
                            aria-label={`Accept booking for ${b.userid?.name || 'devotee'}`}
                            type="button"
                          >
                            <ShieldCheck size={16} /> Accept
                          </button>
                          <button
                            onClick={() => updateStatus(b._id, 'Rejected')}
                            className="reject-btn"
                            aria-label={`Reject booking for ${b.userid?.name || 'devotee'}`}
                            type="button"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )) : (
                    <motion.div
                      key="no-bookings"
                      className="pandit-nobookings"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      aria-live="polite"
                      aria-atomic="true"
                      tabIndex={-1}
                    >
                      No bookings found.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* Devotees Page */}
          {currentPage === "devotees" && (
            <div className="pandit-devotee-list" role="region" aria-label="List of devotees">
              <h3 className="devotee-list-title" tabIndex={-1}>✨ My Devotees ({devoteesList.length})</h3>
              {devoteesList.length === 0 ? (
                <div style={{ marginTop: 28, color: '#888', fontStyle: 'italic' }} tabIndex={-1}>No devotees found.</div>
              ) : (
                <div className="devotees-table" role="table" aria-label="Devotees table">
                  <div className="devotees-table-header" role="rowgroup">
                    <div role="columnheader">Name</div><div role="columnheader">Phone</div><div role="columnheader">Location</div><div role="columnheader">Chat</div>
                  </div>
                  <AnimatePresence>
                    {devoteesList.map(dev => (
                      <motion.div
                        className="devotees-table-row"
                        key={dev.id}
                        role="row"
                        tabIndex={0}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div role="cell">{dev.name}</div>
                        <div role="cell">{dev.phone}</div>
                        <div role="cell">{dev.city || 'N/A'}</div>
                        <div role="cell">
                          <button
                            className="chat-devotee-btn"
                            onClick={() => { setActiveChatDevoteeId(dev.id); setActiveChatDevoteeName(dev.name || "Devotee"); }}
                            aria-label={`Chat with devotee ${dev.name}`}
                            type="button"
                          >
                            <MessageCircle size={20} style={{ marginRight: 6 }} aria-hidden="true" />
                            Chat
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {/* Chat Page (Guide) */}
          {currentPage === "chat" && (
            <div className="pandit-chat-guide" tabIndex={0} aria-live="polite" aria-atomic="true">
              <h3><MessageCircle size={28} style={{ verticalAlign: 'middle', marginRight: 6 }} aria-hidden="true" />
                Start Conversation</h3>
              <p>Select “Chat with Devotee” from Bookings or Devotees.</p>
              <p>All chat transcripts will appear here. (Feature Coming Soon)</p>
            </div>
          )}

          {/* Chat Modal */}
          <AnimatePresence>
            {activeChatDevoteeId && (
              <ChatWindow
                userId={user?._id}
                panditId={activeChatDevoteeId}
                chatName={activeChatDevoteeName}
                onClose={() => setActiveChatDevoteeId(null)}
              />
            )}
          </AnimatePresence>

        </main>

      </div>
    </div>
  );
}

export default PanditDashboard;
