import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../auth';
import { isAuthenticated } from '../auth';

function Login() {
  const [credentials, setCredentials] = useState({
    identifier: '', 
    password: '',
  });
  
  const [message, setMessage] = useState('');
  const [loginMethod, setLoginMethod] = useState('username');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleMethodChange = (e) => {
    setLoginMethod(e.target.value);
    setCredentials({ ...credentials, identifier: '' });
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard'); // Redirect to dashboard if already authenticated
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        identifier: credentials.identifier,
        password: credentials.password,
      });
      
      // Log the response data
      console.log('Response from backend:', response.data);

      // After successful login, store station_name in session storage
      sessionStorage.setItem('station_name', response.data.user.station.station_name);
      console.log('Station name:', response.data.user.station.station_name);
      setMessage('Login successful: ' + JSON.stringify(response.data));
      
      // Store user data in local/session storage
      login(response.data.user);
      
      // Redirect to dashboard and pass user data through state
      navigate('/dashboard', { state: { user: response.data.user } });
      
    } catch (error) {
      setMessage('Error during login: ' + (error.response?.data?.detail || error.message));
      console.error('Login error:', error); // Log any error encountered during login
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>User Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="radio"
              value="username"
              checked={loginMethod === 'username'}
              onChange={handleMethodChange}
            />
            Username
          </label>
          <label>
            <input
              type="radio"
              value="id"
              checked={loginMethod === 'id'}
              onChange={handleMethodChange}
            />
            User ID
          </label>
        </div>
        <label htmlFor="identifier">Identifier</label>
        <input
          type="text"
          id="identifier"
          name="identifier"
          value={credentials.identifier}
          onChange={handleChange}
          placeholder={loginMethod === 'username' ? "Username" : "User ID"}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
