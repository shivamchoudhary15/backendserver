import React from 'react';
import { BrowserRouter as Router, Routes, Route,} from 'react-router-dom';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ReviewForm from './pages/Review';
import Payment from './pages/Payment';
import Booking from './pages/Booking';
import Notifications from './pages/Notifications';
import Dashboard from './pages/Dashboard';
import PanditSignup from './pages/PanditSignup'; 

import ProtectedRoute from './components/ProtectedRoute'; //  yaha pe ham import kara rahe protected routes ko

function App() {
  return (
    <Router>
      <div>
  
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/pandit" element={<PanditSignup />} />


          {/*Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <ReviewForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to home */}
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
