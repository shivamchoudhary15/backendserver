import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home, CalendarCheck2, Users, MessageCircle, IndianRupee, Phone, ShieldCheck,
    Timer, XCircle, Star, ArrowRight, Clock3, LogOut, UserCircle2
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import './PanditDashboard.css';

// ChatWindow Modal - Extracted for clarity and potential reusability
const ChatWindow = ({ userId, panditId, chatName, onClose }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    return (
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
            >
                <div className="chat-window-header">
                    <span>Chat with {chatName}</span>
                    <button onClick={onClose} aria-label="Close chat window" type="button">×</button>
                </div>
                <div className="chat-window-content">
                    <p className="chat-feature-note">[Chat for panditId: {panditId}] - Feature Coming Soon</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// Welcome Section Component
const WelcomeSection = ({ userName }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <motion.div
            className="welcome-section"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h2>{getGreeting()}, **{userName || 'Pandit Ji'}**! 🙏</h2>
            <p>Your devotion strengthens the path. Here's a quick overview of your activities.</p>
        </motion.div>
    );
};

// New DashboardHeader Component
const DashboardHeader = ({ userName, userEmail }) => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000); // Update every second

        return () => clearInterval(timer);
    }, []);

    const formattedDate = currentDateTime.toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const formattedTime = currentDateTime.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });

    return (
        <header className="dashboard-main-header">
            <div className="header-user-info">
                <span className="user-name">Welcome, {userName || 'Pandit Ji'}!</span>
                <span className="user-email">{userEmail || 'pandit@example.com'}</span>
            </div>
            <div className="header-datetime-info">
                <span className="current-date">{formattedDate}</span>
                <span className="current-time">{formattedTime}</span>
            </div>
        </header>
    );
};


const pages = {
    dashboard: "Dashboard",
    bookings: "Bookings",
    devotees: "Devotees",
    chat: "Chats"
};

function PanditDashboard() {
    const navigate = useNavigate();
    // Destructure user properties for cleaner access
    const user = useMemo(() => JSON.parse(localStorage.getItem('user')) || {}, []);
    const { _id, name, email, is_verified, city, experienceYears, phone, languages, speciality } = user; // Added email here

    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState('dashboard');
    const [showStats, setShowStats] = useState(false);
    const [filterDate, setFilterDate] = useState('');
    const [searchName, setSearchName] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [activeChatDevoteeId, setActiveChatDevoteeId] = useState(null);
    const [activeChatDevoteeName, setActiveChatDevoteeName] = useState('');
    const [filterResetTrigger, setFilterResetTrigger] = useState(0);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [loadingDevotees, setLoadingDevotees] = useState(true);


    useEffect(() => {
        const fetchBookings = async () => {
            if (_id) {
                setLoadingBookings(true);
                try {
                    const res = await fetch(`http://localhost:5000/api/bookings/view?panditid=${_id}`);
                    const data = await res.json();
                    setBookings(data);
                } catch (error) {
                    console.error('Failed to fetch bookings:', error);
                    setBookings([]);
                } finally {
                    setLoadingBookings(false);
                }
            } else {
                setBookings([]);
                setLoadingBookings(false);
            }
        };
        fetchBookings();
    }, [_id]);

    const completedCount = useMemo(() => bookings.filter(b => b.status === 'Accepted').length, [bookings]);
    const pendingCount = useMemo(() => bookings.filter(b => b.status === 'Pending').length, [bookings]);
    const rejectedCount = useMemo(() => bookings.filter(b => b.status === 'Rejected').length, [bookings]);
    const uniqueDevoteesCount = useMemo(() => {
        const ids = new Set();
        bookings.forEach(b => b.userid?._id && ids.add(b.userid._id));
        return ids.size;
    }, [bookings]);
    const totalEarnings = completedCount * 500;

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const dateMatch = filterDate ? b.puja_date === filterDate : true;
            const nameMatch = b.userid?.name?.toLowerCase().includes(searchName.toLowerCase());
            const statusMatch = filterStatus ? b.status === filterStatus : true;
            return dateMatch && nameMatch && statusMatch;
        });
    }, [bookings, filterDate, searchName, filterStatus, filterResetTrigger]);

    const devoteesList = useMemo(() => {
        setLoadingDevotees(true);
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
        setLoadingDevotees(false);
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
            if (data.booking) {
                setBookings(prev => prev.map(b => (b._id === id ? data.booking : b)));
            }
        } catch (err) {
            console.error('Failed to update status', err);
            // TODO: Add user-facing error notification
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const statusIcon = {
        Pending: <Timer size={18} color="#e5ae28" />,
        Accepted: <ShieldCheck size={18} color="#23cb7d" />,
        Rejected: <XCircle size={18} color="#e15d7c" />,
    };

    const sidebarItems = [
        { key: 'dashboard', label: 'Dashboard', icon: <Home size={24} /> },
        { key: 'bookings', label: 'Bookings', icon: <CalendarCheck2 size={24} /> },
        { key: 'devotees', label: 'Devotees', icon: <Users size={24} /> },
        { key: 'chat', label: 'Chats', icon: <MessageCircle size={24} /> },
    ];

    const topServices = useMemo(() => {
        const stats = {};
        bookings.forEach(b => {
            const svc = b.serviceid?.name;
            if (svc) stats[svc] = (stats[svc] || 0) + 1;
        });
        return Object.entries(stats).sort((a, b) => b[1] - a[1]).slice(0, 3);
    }, [bookings]);

    const upcoming = useMemo(() => {
        return bookings
            .filter(b =>
                new Date(b.puja_date) >= new Date(Date.now() - 24 * 60 * 60 * 1000) && b.status === "Accepted"
            )
            .sort((a, b) => new Date(a.puja_date) - new Date(b.puja_date))
            .slice(0, 5);
    }, [bookings]);

    const clearFilters = () => {
        setFilterDate('');
        setSearchName('');
        setFilterStatus('');
        setFilterResetTrigger(t => t + 1);
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
                            {name || "Pandit Ji"}
                            <small className={is_verified ? "text-verified" : "text-pending"}>
                                {is_verified ? (
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
                <main className="pandit-content" aria-hidden={activeChatDevoteeId ? true : false}>
                    {/* New Header at the very top of the main content */}
                    <DashboardHeader userName={name} userEmail={email} />

                    <header className="pandit-header-row2" aria-live="polite">
                        <h1 className="pandit-heading">{pages[currentPage]}</h1>
                    </header>

                    {/* Dashboard Page */}
                    {currentPage === 'dashboard' && (
                        <>
                            <WelcomeSection userName={name} />

                            <motion.div
                                className="pandit-profile-card animate-in"
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="pandit-profile-pic" aria-label="Pandit profile picture and status">
                                    <UserCircle2 color="#ffecb3" size={108} className="pandit-avatar" aria-hidden="true" />
                                    <span
                                        className={is_verified ? 'pdash-badge verified' : 'pdash-badge notverified'}
                                        aria-live="polite"
                                    >
                                        {is_verified ? <><ShieldCheck size={18} /> Verified</> : <><Timer size={18} /> Not Verified</>}
                                    </span>
                                </div>
                                <div className="pandit-profile-info">
                                    <h2 tabIndex={-1}>🙏 {name || 'Pandit Ji'}</h2>
                                    <p><strong>City:</strong> {city || 'N/A'}</p>
                                    <p><strong>Experience:</strong> {experienceYears || '--'} years</p>
                                    <div className="pandit-profile-row">
                                        <span><Phone style={{ marginRight: 4 }} size={18} /> {phone || 'N/A'}</span>
                                        <span><b>🗣</b> {(languages && languages.join(', ')) || 'N/A'}</span>
                                        <span><Star style={{ marginBottom: -3 }} size={18} /> {speciality || 'Puja & Rituals'}</span>
                                    </div>
                                    <button
                                        className="stats-toggle-btn"
                                        onClick={() => setShowStats(s => !s)}
                                        aria-expanded={showStats}
                                        aria-controls="stats-section"
                                        type="button"
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
                                                <ShieldCheck size={26} color="#4CAF50" aria-hidden="true" /> {/* Adjusted color */}
                                                <span className="stats-num">{completedCount}</span>
                                                <span>Accepted</span>
                                            </div>
                                            <div className="stats-item" aria-label={`Pending bookings: ${pendingCount}`}>
                                                <Timer size={26} color="#ffb300" aria-hidden="true" /> {/* Adjusted color */}
                                                <span className="stats-num">{pendingCount}</span>
                                                <span>Pending</span>
                                            </div>
                                            <div className="stats-item" aria-label={`Rejected bookings: ${rejectedCount}`}>
                                                <XCircle size={26} color="#e74c3c" aria-hidden="true" /> {/* Adjusted color */}
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
                                <div className="dash-card gradientblue" aria-label={`Devotees: ${uniqueDevoteesCount}`}>
                                    <Users size={32} color="#cc5500" className="dash-card-icon" aria-hidden="true" /> {/* Adjusted color */}
                                    <div>
                                        <span className="dash-card-label">Devotees</span>
                                        <span className="dash-card-value">{uniqueDevoteesCount}</span>
                                    </div>
                                </div>
                                <div className="dash-card gradientmint" aria-label={`Bookings: ${bookings.length}`}>
                                    <CalendarCheck2 size={32} color="#4CAF50" className="dash-card-icon" aria-hidden="true" /> {/* Adjusted color */}
                                    <div>
                                        <span className="dash-card-label">Bookings</span>
                                        <span className="dash-card-value">{bookings.length}</span>
                                    </div>
                                </div>
                                <div className="dash-card gradientyellow" aria-label={`Chats: ${uniqueDevoteesCount}`}>
                                    <MessageCircle size={32} color="#ff9800" className="dash-card-icon" aria-hidden="true" /> {/* Adjusted color */}
                                    <div>
                                        <span className="dash-card-label">Chats</span>
                                        <span className="dash-card-value">{uniqueDevoteesCount}</span>
                                    </div>
                                </div>
                                <div className="dash-card gradientpink" aria-label={`Earnings: ₹${totalEarnings}`}>
                                    <IndianRupee size={32} color="#e65100" className="dash-card-icon" aria-hidden="true" /> {/* Adjusted color */}
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
                                    {loadingBookings ? (
                                        <p className="loading-message">Loading upcoming pujas...</p>
                                    ) : upcoming.length === 0 ? (
                                        <p className="empty-state-message">No upcoming pujas.</p>
                                    ) : (
                                        <ul>
                                            {upcoming.map(b => {
                                                const daysDiff = Math.ceil((new Date(b.puja_date) - new Date()) / (1000 * 60 * 60 * 24));
                                                let tag = '';
                                                let tagColor = '';
                                                if (daysDiff < 1) { tag = 'Today'; tagColor = '#e65100'; } // Darker saffron for today
                                                else if (daysDiff === 1) { tag = 'Tomorrow'; tagColor = '#ffb300'; } // Lighter saffron
                                                else { tag = `In ${daysDiff} days`; tagColor = '#944b00'; } // A spiritual brown
                                                return (
                                                    <li key={b._id}>
                                                        <span><ArrowRight size={14} aria-hidden="true" /> {b.pujaId?.name || "Puja"} – {new Date(b.puja_date).toLocaleDateString('en-IN')}</span>
                                                        <span style={{ backgroundColor: tagColor }} className="date-tag" aria-label={`Date tag: ${tag}`}>{tag}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>

                                {/* Top services widget */}
                                <div className="widget top-services" tabIndex={-1}>
                                    <h3><Star size={22} aria-hidden="true" style={{ marginRight: 6 }} /> Top Services</h3>
                                    {loadingBookings ? (
                                        <p className="loading-message">Loading top services...</p>
                                    ) : topServices.length === 0 ? (
                                        <p className="empty-state-message">No services data available.</p>
                                    ) :
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
                                    className="clear-filters-btn"
                                    onClick={clearFilters}
                                    aria-label="Clear all filters"
                                    type="button"
                                >
                                    Clear Filters
                                </button>
                            </motion.div>
                            {loadingBookings ? (
                                <p className="loading-message">Loading bookings...</p>
                            ) : (
                                <>
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
                                                        <span><Phone size={16} aria-hidden="true" /> {b.userid?.phone || 'N/A'}</span>
                                                        <span><Users size={16} aria-hidden="true" /> {b.serviceid?.name || 'N/A'}</span>
                                                    </div>
                                                    <div className="pandit-booking-row">
                                                        <span>🛕 <b>Puja:</b> {b.pujaId?.name || 'N/A'}</span>
                                                        <span>📅 <b>Date:</b> {new Date(b.puja_date).toLocaleDateString('en-IN')}</span>
                                                        <span>⏰ <b>Time:</b> {b.puja_time}</span>
                                                    </div>
                                                    <div className="pandit-booking-row">
                                                        <span>📍 <b>Location:</b> {b.location || 'N/A'}</span>
                                                    </div>
                                                    <button
                                                        className="chat-from-booking-btn"
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
                                                    No bookings found matching your filters.
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Devotees Page */}
                    {currentPage === "devotees" && (
                        <div className="pandit-devotee-list" role="region" aria-label="List of devotees">
                            <h3 className="devotee-list-title" tabIndex={-1}>✨ My Devotees ({devoteesList.length})</h3>
                            {loadingDevotees ? (
                                <p className="loading-message">Loading devotees list...</p>
                            ) : devoteesList.length === 0 ? (
                                <div className="empty-state-message" tabIndex={-1}>No devotees found yet.</div>
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
                            <p>You can initiate a chat by clicking "Chat with Devotee" on any booking or devotee entry.</p>
                            <p>All chat transcripts will appear here. **(Feature Coming Soon)**</p>
                        </div>
                    )}

                    {/* Chat Modal */}
                    <AnimatePresence>
                        {activeChatDevoteeId && (
                            <ChatWindow
                                userId={_id}
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
