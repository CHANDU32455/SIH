import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function Registration() {
  const [userData, setUserData] = useState({
    user_id: '',
    name: '',
    position: '',
    location: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.password !== userData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/register/', {
        user_id: userData.user_id,
        name: userData.name,
        position: userData.position,
        location: userData.location,
        password: userData.password,
      });
      setMessage('Registration successful: ' + JSON.stringify(response.data));
      
      // Clear form fields on success
      setUserData({
        user_id: '',
        name: '',
        position: '',
        location: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage('Error during registration: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>User Registration</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user_id">User ID</label>
        <input type="text" id="user_id" name="user_id" value={userData.user_id} onChange={handleChange} required />
        
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" value={userData.name} onChange={handleChange} required />
        
        <label htmlFor="position">Position</label>
        <input type="text" id="position" name="position" value={userData.position} onChange={handleChange} required />
        
        <label htmlFor="location">Location</label>
        <input type="text" id="location" name="location" value={userData.location} onChange={handleChange} required />
        
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={userData.password} onChange={handleChange} required />
        
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} required />
        
        <button type="submit" disabled={loading}>Register</button>
      </form>
      <Link to="/">login</Link>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Registration;
