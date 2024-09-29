import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API calls
import '../styles/dashboard.css';
import ca from '../assets/costanalysis.jpeg'; 
import tm from '../assets/timemenagent.png';

export default function Dashboard() {
  const location = useLocation();
  const { user } = location.state || {};  // Get the user data from the state
  const [stations, setStations] = useState([]); // State to store station details
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error status

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stations/'); // Use full API URL to fetch stations
        setStations(response.data); // Set the station data
      } catch (err) {
        setError('Failed to fetch station details'); // Set error message if API call fails
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchStations(); // Call the function to fetch stations
  }, []); // Empty dependency array to run only on component mount

  return (
    <div className="dashboard">
      <h1>Dashboard Page</h1>
      {user ? (
        <div className="user-info">
          <h2>Welcome, {user.name}</h2>
          <p>Location: {user.location}</p>
          <p>Position: {user.position}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}

      <div className="image-container">
        <img src={ca} alt="Cost Analysis" className="dashboard-image" />
        <img src={tm} alt="Time Management" className="dashboard-image" />
      </div>

      <div className="scrolling-box">
        <div className="horizontal-rows">
          {loading ? ( // Show loading state
            <div>Loading stations...</div>
          ) : error ? ( // Show error message if there was an error
            <div>{error}</div>
          ) : (
            // Map through stations to display their details
            stations.map((station, index) => (
              <div key={index} className="row">
                {station.station_name} -- {station.station_location}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
