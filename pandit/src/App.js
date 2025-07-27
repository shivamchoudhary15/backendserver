// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ReviewForm from './pages/Review'; // This might be moved into DashboardReviews.js later
import Payment from './pages/Payment'; // This will be used as DashboardPayment.js
import Notifications from './pages/Notifications';

// Import the main Dashboard layout component
import Dashboard from './pages/Dashboard';

// Import Pandit and Admin related pages
import PanditSignup from './pages/PanditSignup';
import PanditDashboard from './pages/PanditDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

// Import ProtectedRoute components
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
        />

        {/* Other Protected User Routes (if not nested under /dashboard) */}
        {/* If you want these to be direct top-level protected routes, keep them.
            Otherwise, they should be moved as sub-routes under /dashboard.
            For this solution, I'm moving Payment and ReviewForm under /dashboard.
            Notifications can stay here if it's a separate full-page view.
        */}
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
