import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Registration from './pages/registration';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import AddStations from './pages/add_stations';
import NavBar from './components/navbar';

function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add_stations" element={<AddStations />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;