import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../styles/assetform.css';

const AssetForm = () => {
  const [formData, setFormData] = useState({
    asset_id: '',
    name: '',
    location: 'inventory',
    last_location: 'inventory',
    status: 'INACTIVE',
    asset_type: '',
    manufactured_date: '',
    expiry_date: '',
    station_id: null,  // For station_id field
  });

  const [stationIds, setStationIds] = useState([]);
  const [stationLocations, setStationLocations] = useState([]);

  // Fetch stations on component mount
  useEffect(() => {
    axios.get('http://localhost:8000/api/stations/')
      .then(response => {
        const stationIdOptions = response.data.map(station => ({
          value: station.station_id,
          label: station.station_id,
        }));

        const locationOptions = response.data.map(station => ({
          value: station.station_location,
          label: station.station_location,
        }));

        setStationIds(stationIdOptions);
        setStationLocations(locationOptions);
      })
      .catch(error => {
        console.error("There was an error fetching the stations!", error);
      });
  }, []);

  // Handle change for text inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle station selection
  const handleStationChange = (selectedOption) => {
    setFormData({
      ...formData,
      station_id: selectedOption.value,
    });
  };

  // Handle location selection
  const handleLocationChange = (selectedOption, field) => {
    setFormData({
      ...formData,
      [field]: selectedOption.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:8000/api/assets/', formData)
      .then(response => {
        console.log(response.data);
        alert("Asset added successfully!");
        // Reset form after successful submission
        setFormData({
          asset_id: '',
          name: '',
          location: 'inventory',
          last_location: 'inventory',
          status: 'INACTIVE',
          asset_type: '',
          manufactured_date: '',
          expiry_date: '',
          station_id: null,
        });
      })
      .catch(error => {
        console.error("There was an error adding the asset!", error);
      });
  };

  return (
    <form className="asset-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <h2>Add Asset</h2>
        <label htmlFor="asset_id">Asset ID</label>
        <input
          type="text"
          id="asset_id"
          name="asset_id"
          placeholder="Enter Asset ID"
          value={formData.asset_id}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Asset Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter Asset Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Station Dropdown */}
      <div className="form-group">
        <label htmlFor="station_id">Station ID</label>
        <Select
          id="station_id"
          name="station_id"
          options={stationIds}
          onChange={handleStationChange}
          placeholder="Select Station ID"
          required
        />
      </div>

      {/* Location Dropdown */}
      <div className="form-group">
        <label htmlFor="location">Location</label>
        <Select
          id="location"
          name="location"
          options={stationLocations}
          onChange={(selectedOption) => handleLocationChange(selectedOption, 'location')}
          placeholder="Select Location"
          value={{ value: formData.location, label: formData.location }}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="last_location">Last Location</label>
        <Select
          id="last_location"
          name="last_location"
          options={stationLocations}
          onChange={(selectedOption) => handleLocationChange(selectedOption, 'last_location')}
          placeholder="Select Last Location"
          value={{ value: formData.last_location, label: formData.last_location }}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="MOVING">Moving</option>
          <option value="MOVED">Moved</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="asset_type">Asset Type</label>
        <select
          id="asset_type"
          name="asset_type"
          value={formData.asset_type}
          onChange={handleChange}
          required
        >
          <option value="">Select Asset Type</option>
          <option value="VEHICLE">Vehicle</option>
          <option value="WEAPON">Weapon</option>
          <option value="ELECTRONIC">Electronic Device</option>
          <option value="PROTECTIVE_GEAR">Protective Gear</option>
          <option value="OFFICE_EQUIPMENT">Office Equipment</option>
          <option value="MISC">Miscellaneous Equipment</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="manufactured_date">Manufactured Date</label>
        <input
          type="date"
          id="manufactured_date"
          name="manufactured_date"
          value={formData.manufactured_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="expiry_date">Expiry Date</label>
        <input
          type="date"
          id="expiry_date"
          name="expiry_date"
          value={formData.expiry_date}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default AssetForm;
