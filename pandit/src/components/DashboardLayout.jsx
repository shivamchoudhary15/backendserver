import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main content area for nested routes */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
