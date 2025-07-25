// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  // Avoid SSR issues - check if window exists
  const isLargeScreen = typeof window !== 'undefined' ? window.innerWidth > 900 : true;
  const [open, setOpen] = useState(isLargeScreen);
  const location = useLocation();

  useEffect(() => {
    function handleResize() {
      setOpen(window.innerWidth > 900);
    }
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on navigation in small screens
  useEffect(() => {
    if (window.innerWidth <= 900) {
      setOpen(false);
    }
  }, [location.pathname]);

  return (
    <>
      <button
        className="sidebar-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="hamburger">
          <span />
          <span />
          <span />
        </div>
      </button>
      <nav className={`sidebar${open ? '' : ' closed'}`}>
        <h2 className="sidebar-title">Admin Dashboard</h2>
        <NavLink to="/admin/home" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Home
        </NavLink>
        <NavLink to="/admin/pandits" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Pandits
        </NavLink>
        <NavLink to="/admin/devotees" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Devotees
        </NavLink>
        <NavLink to="/admin/bookings" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Bookings
        </NavLink>
        <NavLink to="/admin/poojas" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Pooja
        </NavLink>
        <NavLink to="/admin/map" className={({ isActive }) => (isActive ? 'sidebar-link active' : 'sidebar-link')}>
          Map
        </NavLink>
        <button
          className="logout-button"
          onClick={() => {
            localStorage.clear();
            window.location.href = '/';
          }}
          aria-label="Logout"
          type="button"
        >
          Logout
        </button>
      </nav>
    </>
  );
}

export default Sidebar;
