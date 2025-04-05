import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if there's no token
    return <Navigate to="/user-signin" />;
  }

  // If there is a token, render the protected component
  return children;
};

export default PrivateRoute; 