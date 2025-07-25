// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [open, setOpen] = useState(window.innerWidth > 900);

  // Responsive, sidebar auto-collapses under 900px
  React.useEffect(() => {
    const onResize = () => setOpen(window.innerWidth > 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(o => !o)}
      >
        <div className="hamburger">
          <span />
          <span />
          <span />
        </div>
      </button>
      <nav className={`sidebar${open ? '' : ' closed'}`}>
        <h2 className="sidebar-title">Admin Dashboard</h2>
        <NavLink to="/admin/home" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>Home</NavLink>
        <NavLink to="/admin/pandits" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>Pandits</NavLink>
        <NavLink to="/admin/devotees" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>Devotees</NavLink>
        <NavLink to="/admin/bookings" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>Bookings</NavLink>
        <NavLink to="/admin/poojas" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>Pooja</NavLink>
        <NavLink to="/admin/map" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>Map</NavLink>
        <button className="logout-button" onClick={() => { localStorage.clear(); window.location.href = '/'; }} aria-label="Logout">Logout</button>
      </nav>
    </>
  );
}

export default Sidebar;
