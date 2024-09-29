import React, { useState } from 'react';
import axios from 'axios';
import '../styles/assetform.css';

const AssetForm = () => {
  const [formData, setFormData] = useState({
    asset_id: '',
    name: '',
    location: 'inventory',
    last_location: 'inventory',
    status: '',
    asset_type: '',
    expiry_date: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/assets/', formData)
      .then(response => {
        console.log(response.data);
        alert("Asset added successfully!");
      })
      .catch(error => {
        console.error("There was an error adding the asset!", error);
      });
  };

  return (
    <form className="asset-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="asset_id">Asset ID</label>
        <input
          type="text"
          id="asset_id"
          name="asset_id"
          placeholder="Enter Asset ID"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Enter Asset Name"
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Current Location"
          onChange={handleChange}
          value={formData.location}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="last_location">Last Location</label>
        <input
          type="text"
          id="last_location"
          name="last_location"
          placeholder="Previous Location"
          onChange={handleChange}
          value={formData.last_location}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          onChange={handleChange}
          required
        >
          <option value="">Select Status</option>
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
        <label htmlFor="expiry_date">Expiry Date</label>
        <input
          type="date"
          id="expiry_date"
          name="expiry_date"
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-btn">Submit</button>
    </form>
  );
};

export default AssetForm;
