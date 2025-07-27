// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';

// Dashboard Layout and Sub-pages
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import DashboardProfile from './pages/DashboardProfile';
import DashboardSearchPooja from './pages/DashboardSearchPooja';
import DashboardSearchPandits from './pages/DashboardSearchPandits';
import DashboardBookingForm from './pages/DashboardBookingForm';
import DashboardBookings from './pages/DashboardBookings';
import DashboardReviews from './pages/DashboardReviews';
import DashboardPayment from './pages/DashboardPayment';

// Other Protected Pages (if not nested under dashboard)
import Notifications from './pages/Notifications';

// Pandit and Admin related pages
import PanditSignup from './pages/PanditSignup';
import PanditDashboard from './pages/PanditDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

// Protected Route Components
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/pandit" element={<PanditSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pandit-dashboard" element={<PanditDashboard />} /> {/* Assuming this is public or has its own protection */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        {/* User Protected Dashboard Routes (Nested) */}
        {/* The Dashboard component will now handle its own sub-routes */}
        <Route
          path="/dashboard/*" // Notice the /* for nested routes
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes for Dashboard */}
          <Route index element={<DashboardHome />} /> {/* Default route for /dashboard */}
          <Route path="home" element={<DashboardHome />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="search-pooja" element={<DashboardSearchPooja />} />
          <Route path="search-pandits" element={<DashboardSearchPandits />} />
          <Route path="booking" element={<DashboardBookingForm />} />
          <Route path="booking-history" element={<DashboardBookings />} />
          <Route path="reviews" element={<DashboardReviews />} />
          <Route path="payment" element={<DashboardPayment />} />
          {/* Catch-all for /dashboard/* routes if a specific sub-route isn't found */}
          <Route path="*" element={<Navigate to="home" replace />} />
        </Route>

        {/* Other Protected User Routes (if not nested under /dashboard) */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
