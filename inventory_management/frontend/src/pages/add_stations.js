import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AddStations() {
  const [stations, setStations] = useState({
    station_id: '',
    station_name: '',
    station_location: '',
  });

  const [availableStations, setAvailableStations] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    setStations({ ...stations, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a station
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/stations/', {
        station_id: stations.station_id,
        station_name: stations.station_name,
        station_location: stations.station_location,
      });

      setMessage('Station created successfully: ' + JSON.stringify(response.data));
      console.log(response.data);

      // Clear input fields after submission
      setStations({
        station_id: '',
        station_name: '',
        station_location: '',
      });

      // Refresh the list of available stations after creation
      fetchAvailableStations();

    } catch (error) {
      setMessage('Error creating station: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch all available stations from the backend
  const fetchAvailableStations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/stations/');
      setAvailableStations(response.data);  // Assuming response contains the list of stations
    } catch (error) {
      setMessage('Error fetching stations: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Fetch stations when the component mounts
  useEffect(() => {
    fetchAvailableStations();
  }, []);

  return (
    <div>
      <h2>Add Station</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="station_id">Station ID</label>
          <input
            type="text"
            id="station_id"
            name="station_id"
            value={stations.station_id}
            onChange={handleChange}
            placeholder="Enter Station ID"
            required
          />
        </div>
        <div>
          <label htmlFor="station_name">Station Name</label>
          <input
            type="text"
            id="station_name"
            name="station_name"
            value={stations.station_name}
            onChange={handleChange}
            placeholder="Enter Station Name"
            required
          />
        </div>
        <div>
          <label htmlFor="station_location">Station Location</label>
          <input
            type="text"
            id="station_location"
            name="station_location"
            value={stations.station_location}
            onChange={handleChange}
            placeholder="Enter Station Location"
            required
          />
        </div>
        <button type="submit" disabled={loading}>Add Station</button>
      </form>
      
      {message && <p>{message}</p>}

      <h2>Available Stations</h2>
      <button onClick={fetchAvailableStations}>Refresh Stations</button>
      {availableStations.length > 0 ? (
        <ul>
          {availableStations.map((station) => (
            <li key={station.station_id}> {/* Ensure station_id is unique */}
              <strong>{station.station_name}</strong> - {station.station_location}
            </li>
          ))}
        </ul>
      ) : (
        <p>No stations available.</p>
      )}

      <Link to="/register">Register</Link>
    </div>
  );
}

export default AddStations;
