import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

function getUserRole() {
  return sessionStorage.getItem('position');  // Retrieve the role (position) from sessionStorage
}

function ProtectedRoute({ element, allowedRoles }) {
  const userRole = getUserRole();  // Get the user's role

  if (!isAuthenticated()) {
    return <Navigate to="/" />;  // Redirect to login if not authenticated
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;  // Redirect to unauthorized page if role is not allowed
  }

  return element;  // Render the component if authentication and role match
}

export default ProtectedRoute;
