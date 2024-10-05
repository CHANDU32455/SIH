import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/stationdetails.css';

export default function StationDetails() {
  const location = useLocation();
  const { station_name } = location.state || {};
  const [assets, setAssets] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("asset_type");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/assets/station/${station_name}/?sort=${sortCriteria}`);
        setAssets(response.data);
      } catch (error) {
        console.error("Failed to fetch assets for this station.", error);
      }
    };

    if (station_name) {
      fetchAssets();
    }
  }, [station_name, sortCriteria]);

  const handleSortChange = (event) => {
    setSortCriteria(event.target.value);
  };

  return (
    <div className="station-details">
      <h1>Station Details Page</h1>
      {station_name ? (
        <div>
          <p>Station Name: {station_name}</p>
          <div className="sort-container">
            <label htmlFor="sort-by">Sort by: </label>
            <select id="sort-by" value={sortCriteria} onChange={handleSortChange}>
              <option value="asset_type">Asset Type</option>
              <option value="status">Status</option>
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
          <div className="assets-container">
            {assets.length > 0 ? (
              assets.map(asset => (
                <div key={asset.asset_id} className="asset-card">
                  <p>Name: {asset.name}</p>
                  <p>Status: {asset.status}</p>
                  <p>Type: {asset.asset_type}</p>
                </div>
              ))
            ) : (
              <p>No assets available for this station.</p>
            )}
          </div>
        </div>
      ) : (
        <p>No station data available</p>
      )}
    </div>
  );
}
