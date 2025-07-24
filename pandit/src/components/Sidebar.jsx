import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <nav className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <h2 className="sidebar-title">Admin Dashboard</h2>
      <NavLink
        to="/admin/home"
        className={({ isActive }) =>
          isActive ? 'sidebar-link active' : 'sidebar-link'
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/admin/pandits"
        className={({ isActive }) =>
          isActive ? 'sidebar-link active' : 'sidebar-link'
        }
      >
        Pandits
      </NavLink>
      <NavLink
        to="/admin/devotees"
        className={({ isActive }) =>
          isActive ? 'sidebar-link active' : 'sidebar-link'
        }
      >
        Devotees
      </NavLink>
      <NavLink
        to="/admin/bookings"
        className={({ isActive }) =>
          isActive ? 'sidebar-link active' : 'sidebar-link'
        }
      >
        Bookings
      </NavLink>
      <NavLink
        to="/admin/map"
        className={({ isActive }) =>
          isActive ? 'sidebar-link active' : 'sidebar-link'
        }
      >
        Map
      </NavLink>
      <button
        className="logout-button"
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
        aria-label="Logout"
      >
        Logout
      </button>
    </nav>
  );
}

export default Sidebar;
