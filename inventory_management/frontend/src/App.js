import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Registration from './pages/registration';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddStations from './pages/add_stations';
import NavBar from './components/navbar';
import Assests from './components/assests';
import AssetForm from './pages/add_assests';
import Logout from './components/logout';
import Reporting from './pages/reporting';
import DynamicResourceAllocation from './pages/dynamic_resource_allocation';
import StationDetails from './pages/station_details';
import UserUpdation from './pages/userupdation';
import ProtectedRoute from './ProtectedRoute';
import Stations from './components/stations';
import AuditsPage from './pages/audits';
import LoadingAnimation from './components/loading';
import BulkAssetUpload from './pages/bulk_assets_upload';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Public routes */}
          <Route path="/loading" element={<LoadingAnimation />} />

          {/* Role-based protected routes */}
          <Route path="/register" 
                 element={<ProtectedRoute element={<Registration />} allowedRoles={['admin']} />} />
          <Route path="/userupdation" 
                 element={<ProtectedRoute element={<UserUpdation />} allowedRoles={['admin']} />} />
          <Route path="/dashboard" 
                 element={<ProtectedRoute element={<Dashboard />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/stations"
                 element={<ProtectedRoute element={<Stations />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/add_stations" 
                 element={<ProtectedRoute element={<AddStations />} allowedRoles={['admin']} />} />
          <Route path="/assests" 
                 element={<ProtectedRoute element={<Assests />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/add_assests" 
                 element={<ProtectedRoute element={<AssetForm />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/bulk_assets_upload" 
                 element={<ProtectedRoute element={<BulkAssetUpload />} allowedRoles={['admin']} />} />
          <Route path="/station_details" 
                 element={<ProtectedRoute element={<StationDetails />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/audits" 
                 element={<ProtectedRoute element={<AuditsPage />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/reporting" 
                 element={<ProtectedRoute element={<Reporting />} allowedRoles={['admin', 'stationmaster']} />} />
          <Route path="/dynamic_resource_allocation" 
                 element={<ProtectedRoute element={<DynamicResourceAllocation />} allowedRoles={['admin']} />} />
          <Route path="/logout" element={<Logout />} />

          {/* Unauthorized page */}
          <Route path="/unauthorized" element={<div className="unauthorized">Unauthorized - You don't have permission to view this page.</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
