import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import '../styles/userupdation.css'; // Import the CSS

const UserUpdation = () => {
    const [userId, setUserId] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        location: '',
        station: null
    });
    const [stations, setStations] = useState([]);

    // Handle input change for user ID
    const handleInputChange = (e) => {
        setUserId(e.target.value);
        setError('');
        setFormData({ name: '', position: '', location: '', station: null }); // Reset form data
    };

    // Fetch user data by user ID
    const fetchUserData = async () => {
        if (!userId) {
            setError('Please provide a user ID to fetch user data.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/register/?user_id=${userId}`);
            setFormData({
                name: response.data.name,
                position: response.data.position,
                location: response.data.location,
                station: response.data.station
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred while fetching user data.');
        }
    };

    // Fetch stations for the dropdown
    const fetchStations = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/stations/');
            const stationOptions = response.data.map(station => ({
                value: station.station_id,
                label: station.station_name
            }));
            setStations(stationOptions);
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred while fetching stations.');
        }
    };

    useEffect(() => {
        fetchStations();
    }, []);

    // Handle form field changes
    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle station selection
    const handleStationChange = (selectedOption) => {
        setFormData({
            ...formData,
            station: selectedOption ? selectedOption.value : null,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        try {
            const response = await axios.put(`http://localhost:8000/api/register/?user_id=${userId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('User updated successfully:', response.data);
            alert('User updated successfully!');
        } catch (error) {
            console.error('Error updating user data:', error.response?.data);
            alert(error.response?.data.detail || 'An error occurred while updating user data.');
        }
    };

    return (
        <div className="user-updation-wrapper">
            <h1 className="user-updation-title">Update User Details</h1>
            <div className="user-updation-search">
                <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={handleInputChange}
                    className="user-updation-input-search"
                />
                <button onClick={fetchUserData} className="user-updation-button-search">Fetch Data</button>
            </div>
            {error && <div className="user-updation-error">{error}</div>}
            <div className="user-updation-details">
                <form onSubmit={handleSubmit}>
                    <div className="user-updation-field">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            className="user-updation-input"
                        />
                    </div>
                    <div className="user-updation-field">
                        <label>Position:</label>
                        <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleFormChange}
                            className="user-updation-input"
                        />
                    </div>
                    <div className="user-updation-field">
                        <label>Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleFormChange}
                            className="user-updation-input"
                        />
                    </div>
                    <div className="user-updation-field">
                        <label>Station:</label>
                        <Select
                            options={stations}
                            value={stations.find(station => station.value === formData.station)}
                            onChange={handleStationChange}
                            className="user-updation-select"
                            placeholder="Select a Station"
                        />
                    </div>
                    <button type="submit" className="user-updation-button">Update User</button>
                </form>
            </div>
        </div>
    );
}

export default UserUpdation;
