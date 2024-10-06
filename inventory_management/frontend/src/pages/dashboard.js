import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ca from '../assets/costanalysis.jpeg';
import tm from '../assets/timemenagent.png';
import '../styles/dashboard.css';

export default function Dashboard() {
  const [stations, setStations] = useState([]); // State to store station details
  const [loading, setLoading] = useState(true); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error status

  // Fetch username, position, and station_name from session storage
  const username = sessionStorage.getItem('username');
  const position = sessionStorage.getItem('position');
  const stationName = sessionStorage.getItem('station_name');

  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchStations = async () => {
      setLoading(true);
      try {
        const response = position === 'admin' 
          ? await axios.get('http://localhost:8000/api/stations/') // Fetch all stations for admin
          : await axios.get(`http://localhost:8000/api/stations/?station_name=${stationName}`); // Fetch specific station for station master
        
        // Set stations in state
        setStations(position === 'admin' ? response.data : response.data.filter(station => station.station_name === stationName));

      } catch (err) {
        setError('Failed to fetch station details');
      } finally {
        setLoading(false);
      }
    };

    fetchStations(); // Call the function to fetch stations
  }, [position, stationName]);

  // Function to handle station click and navigate to the asset page
  const handleStationClick = (station) => {
    navigate('/station_details', { state: { station_name: station.station_name } }); // Pass station_name via state
  };

  return (
    <div className="dashboard">
      <h1>MadhyaPradesh Police</h1>
      {username ? (
        <div className="user-info">
          <h2>Welcome, {username}</h2>
        </div>
      ) : (
        <p>No user data available</p>
      )}

      {position === 'admin' && (
        <div className="Dashboard-actions-container">
          <Link to="/add_stations" className="Dashboard-action-button">Add Stations</Link>
          <Link to="/add_assests" className="Dashboard-action-button">Add Assets</Link>
          <Link to="/register" className="Dashboard-action-button">Add Station Masters</Link>
          <Link to="/userupdation" className="Dashboard-action-button">UpdateUser</Link>
        </div>
      )}

      <div className="image-container">
        <img src={ca} alt="Cost Analysis" className="dashboard-image" />
        <img src={tm} alt="Time Management" className="dashboard-image" />
      </div>

      <div className="scrolling-box">
        <div className="horizontal-rows">
          {loading ? (
            <div>Loading stations...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
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
