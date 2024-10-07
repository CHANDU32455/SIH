import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Registration from './pages/registration';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddStations from './pages/add_stations';
import NavBar from './components/navbar';
import AssetForm from './pages/add_assests';
import Logout from './components/logout';
import Audits from './pages/audits';
import Reporting from './pages/reporting';
import DynamicResourceAllocation from './pages/dynamic_resource_allocation';
import StationDetails from './pages/station_details';
import UserUpdation from './pages/userupdation';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Role-based protected routes */}
          <Route path="/register" 
                 element={<ProtectedRoute element={<Registration />} allowedRoles={['admin']} />} />
          <Route path="/userupdation" 
                 element={<ProtectedRoute element={<UserUpdation />} allowedRoles={['admin']} />} />
          <Route path="/dashboard" 
                 element={<ProtectedRoute element={<Dashboard />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/add_stations" 
                 element={<ProtectedRoute element={<AddStations />} allowedRoles={['admin']} />} />
          <Route path="/add_assests" 
                 element={<ProtectedRoute element={<AssetForm />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/station_details" 
                 element={<ProtectedRoute element={<StationDetails />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/audits" 
                 element={<ProtectedRoute element={<Audits />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/reporting" 
                 element={<ProtectedRoute element={<Reporting />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/dynamic_resource_allocation" 
                 element={<ProtectedRoute element={<DynamicResourceAllocation />} allowedRoles={['admin']} />} />
          <Route path="/logout" element={<Logout />} />

          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<div>Unauthorized - You don't have permission to view this page.</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
