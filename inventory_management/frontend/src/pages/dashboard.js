import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Import axios for making API calls
import ca from '../assets/costanalysis.jpeg';
import tm from '../assets/timemenagent.png';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [stations, setStations] = useState([]); // State to store station details
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error status

  // Fetch username and position from session storage
  const username = sessionStorage.getItem('username');
  const position = sessionStorage.getItem('position');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true); // Set loading state to true before fetching data
      try {
        let response;
        
        // Check if the user is an admin
        if (position === 'admin') {
          // Fetch all stations for admin
          response = await axios.get('http://localhost:8000/api/stations/');
        } else {
          // Fetch the station based on the username (station master)
          response = await axios.get(`http://localhost:8000/api/stations/?station_master_username=${username}`);
        }

        setStations(response.data); // Set the station data
      } catch (err) {
        setError('Failed to fetch station details'); // Set error message if API call fails
      } finally {
        setLoading(false); // Set loading to false after fetch is complete
      }
    };

    fetchStations(); // Call the function to fetch stations
  }, [position, username]); // Dependency array to run this effect when position or username changes

  // Function to handle station click and navigate to the asset page
  const handleStationClick = (station) => {
    navigate('/station_details', { state: { station_name: station.station_name } }); // Pass station_name via state
  };

  return (
    <div className="dashboard">
      <h1>Dashboard Page</h1>
      {username ? (
        <div className="user-info">
          <h2>Welcome, {username}</h2>
          <p>Position: {position}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}

      {position === 'admin' && (
        <div className="Dashboard-actions-container">
          <Link to="/add_stations" className="Dashboard-action-button">Add Stations</Link>
          <Link to="/add_assests" className="Dashboard-action-button">Add Assets</Link>
          <Link to="/register" className="Dashboard-action-button">Add Station Masters</Link>
        </div>
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
              <div
                key={index}
                className="row"
                onClick={() => handleStationClick(station)}
              >
                {station.station_name} -- {station.station_location}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
