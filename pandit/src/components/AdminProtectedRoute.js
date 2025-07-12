import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const [authorized, setAuthorized] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user && user.role === 'admin') {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, []);

  if (authorized === null) return <div>Loading...</div>; // prevent flash redirect
  if (authorized === false) return <Navigate to="/login" replace />;

  return children;
};

export default AdminProtectedRoute;

