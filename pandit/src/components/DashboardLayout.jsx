import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import './DashboardLayout.css';

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Handlers for sidebar hover
  const handleMouseEnter = () => setSidebarOpen(true);
  const handleMouseLeave = () => setSidebarOpen(false);

  return (
    <div
      className={`dashboard-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      style={{ minHeight: '100vh', backgroundColor: '#f5f7fb' }}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      </div>
      <main className="dashboard-main">
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? "←" : "→"}
        </button>
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
