import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Registration from './pages/registration';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddStations from './pages/add_stations';
import NavBar from './components/navbar';
import AssetForm from './pages/add_assests';
import Logout from './components/logout';
import { isAuthenticated } from './auth';
import StationDetails from './pages/station_details';

function ProtectedRoute({ element, ...rest }) {
  return isAuthenticated() ? element : <Navigate to="/" />;
}

function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Protecting the following routes */}
          <Route path="/register" element={<ProtectedRoute element={<Registration />} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/add_stations" element={<ProtectedRoute element={<AddStations />} />} />
          <Route path="/add_assests" element={<ProtectedRoute element={<AssetForm />} />} />
          <Route path="/station_details" element={<ProtectedRoute element={<StationDetails />} />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
