import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import Home from './Home';
import PanditsPage from './PanditsPage';
import DevoteesPage from './DevoteesPage';
import BookingHistory from './BookingHistory';
import MapView from './MapView';

function AdminDashboard({ userLocations = [], panditLocations = [] }) {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<DashboardLayout />}>
          {/* Redirect index /admin path to /admin/home */}
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<Home />} />
          <Route path="pandits" element={<PanditsPage />} />
          <Route path="devotees" element={<DevoteesPage />} />
          <Route path="bookings" element={<BookingHistory />} />
          <Route
            path="map"
            element={
              <MapView userLocations={userLocations} panditLocations={panditLocations} />
            }
          />
        </Route>

        {/* Optional: redirect any unknown routes to admin home */}
        <Route path="*" element={<Navigate to="/admin/home" replace />} />
      </Routes>
    </Router>
  );
}

export default AdminDashboard;
