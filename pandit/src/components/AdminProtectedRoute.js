import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  let user;

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    user = null;
  }

  if (!token || !user || user.role !== 'admin') {
    alert("You are not authorized to access the admin panel.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
