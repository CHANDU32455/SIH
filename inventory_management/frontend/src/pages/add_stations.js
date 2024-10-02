import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select'; // Import react-select
import '../styles/add_stations.css';

function AddStations() {
  const [stations, setStations] = useState({
    station_id: '',
    station_name: '',
    station_location: '',
    station_master: null, // Will hold the index of the selected station master
  });

  const [availableStationMasters, setAvailableStationMasters] = useState([]); // For station masters
  const [availableStations, setAvailableStations] = useState([]); // For stations list
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAvailable, setLoadingAvailable] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setStations({ ...stations, [e.target.name]: e.target.value });
  };

  // Handle station master change
const handleStationMasterChange = (selectedOption) => {
  // Find the index of the selected station master and add 1 to start counting from 1
  const selectedMasterIndex = availableStationMasters.findIndex(option => option.value === selectedOption.value) + 1; 
  setStations({ ...stations, station_master: selectedMasterIndex }); // Set the index of the selected master
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/stations/', {
        station_id: stations.station_id,
        station_name: stations.station_name,
        station_location: stations.station_location,
        station_master_id: stations.station_master, // Send the selected master index
      });

      setMessage('Station created successfully: ' + JSON.stringify(response.data));
      setStations({
        station_id: '',
        station_name: '',
        station_location: '',
        station_master: null, // Clear selection after submission
      });

      fetchAvailableStations(); // Refresh the station list
    } catch (error) {
      console.error("Error creating station:", error);
      setMessage('Error creating station: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch available station masters from the backend
  const fetchAvailableStationMasters = async () => {
    setLoadingAvailable(true);
    try {
      const response = await axios.get('http://localhost:8000/api/station-masters/'); // Assuming this endpoint provides station masters
      const options = response.data.map((master, index) => ({
        value: master.user_id, // Assuming the station master has a user_id field
        label: master.name, // Use the name for the dropdown label
      }));
      setAvailableStationMasters(options); // Set station masters as options
    } catch (error) {
      console.error("Error fetching station masters:", error);
      setMessage('Error fetching station masters: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoadingAvailable(false);
    }
  };

  // Fetch available stations from the backend
  const fetchAvailableStations = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/stations/');
      setAvailableStations(response.data); // Set stations as options
    } catch (error) {
      console.error("Error fetching stations:", error);
      setMessage('Error fetching stations: ' + (error.response?.data?.detail || error.message));
    }
  };

  // Fetch station masters and stations when the component mounts
  useEffect(() => {
    fetchAvailableStationMasters();
    fetchAvailableStations(); // Fetch stations initially
  }, []);

  return (
    <div className="add-stations">
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
        <div>
          <label htmlFor="station_master_id">Station Master</label>
          <Select
            id="station_master"
            name="station_master"
            value={availableStationMasters.find(option => option.value === stations.station_master_id)}
            onChange={handleStationMasterChange}
            options={availableStationMasters}
            isLoading={loadingAvailable}
            placeholder="Select Station Master"
          />
        </div>
        <button type="submit" disabled={loading}>Add Station</button>
      </form>

      {message && <p>{message}</p>}

      <h2>Available Stations</h2>
      {availableStations.length > 0 ? (
        <ul>
          {availableStations.map((station) => (
            <li key={station.station_id}>
              <strong>{station.station_name}</strong> - {station.station_location}
            </li>
          ))}
        </ul>
      ) : (
        <p>No stations available.</p>
      )}
    </div>
  );
}

export default AddStations;
