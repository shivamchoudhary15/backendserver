import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Home from './Home';
import PanditsPage from './PanditsPage'; // Your existing Pandits list page component
import DevoteesPage from './DevoteesPage'; // Your existing Devotees list page component
import BookingHistory from './BookingHistory';
import MapView from './MapView';

function AdminDashboard({ userLocations = [], panditLocations = [] }) {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="pandits" element={<PanditsPage />} />
          <Route path="devotees" element={<DevoteesPage />} />
          <Route path="bookings" element={<BookingHistory />} />
          <Route path="map" element={<MapView userLocations={userLocations} panditLocations={panditLocations} />} />
          <Route index element={<Navigate to="home" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AdminDashboard;
