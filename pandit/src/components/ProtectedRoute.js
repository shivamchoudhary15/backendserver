// ye unathorised user ko prevent karega or navigate kareya home page jab user ke pass token nahi hai 
import React from 'react';
import {Navigate} from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  if (!token) {
    // yaa se redirect ho jayega 
    return <Navigate to="/home" replace />;
  }

 
  return children;
}
