import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
  const location = useLocation();
  const { user } = location.state || {};  // Get the user data from the state

  return (
    <div>
      <h1>Dashboard Page</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <p>Location: {user.location}</p>
          <p>Position: {user.position}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
}
