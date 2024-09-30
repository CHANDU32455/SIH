import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login } from '../auth';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        identifier: credentials.identifier,
        password: credentials.password,
      });
      
      setMessage('Login successful: ' + JSON.stringify(response.data));
      login(response.data.user);  // Store user data in session storage

      navigate('/dashboard', { state: { user: response.data.user } });  // Redirect to dashboard
      
    } catch (error) {
      setMessage('Error during login: ' + (error.response?.data?.detail || error.message));
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
      <Link to="/register">Register</Link>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
