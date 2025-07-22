import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  return (
    <nav className="sidebar">
      <h2>Admin Dashboard</h2>
      <NavLink to="/admin/home" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
      <NavLink to="/admin/pandits" className={({ isActive }) => (isActive ? 'active' : '')}>Pandits</NavLink>
      <NavLink to="/admin/devotees" className={({ isActive }) => (isActive ? 'active' : '')}>Devotees</NavLink>
      <NavLink to="/admin/bookings" className={({ isActive }) => (isActive ? 'active' : '')}>Bookings</NavLink>
      <NavLink to="/admin/map" className={({ isActive }) => (isActive ? 'active' : '')}>Map</NavLink>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
      >
        Logout
      </button>
    </nav>
  );
}

export default Sidebar;
