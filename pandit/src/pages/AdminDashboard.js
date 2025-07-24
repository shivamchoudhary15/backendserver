// src/pages/AdminDashboard.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import DashboardLayout from '../components/DashboardLayout';
import Home1 from './Home1';
import PanditsPage from './PanditsPage';
import DevoteesPage from './DevoteesPage';
import BookingHistory from './BookingHistory';
import MapView from './MapView';

function AdminDashboard({ userLocations = [], panditLocations = [] }) {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        {/* Redirect /admin to /admin/home */}
        <Route index element={<Navigate to="home1" replace />} />

        <Route path="home1" element={<Home1 />} />
        <Route path="pandits" element={<PanditsPage />} />
        <Route path="devotees" element={<DevoteesPage />} />
        <Route path="bookings" element={<BookingHistory />} />
        <Route
          path="map"
          element={<MapView userLocations={userLocations} panditLocations={panditLocations} />}
        />

        {/* Redirect unknown /admin routes back to home1 */}
        <Route path="*" element={<Navigate to="home1" replace />} />
      </Route>
    </Routes>
  );
}

export default AdminDashboard;
