import { Link, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import AddStations from "../pages/add_stations";
function Stations() {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa', // Light background color for contrast
        padding: '20px',
        fontFamily: 'Arial, sans-serif', // Consistent font
    };

    const navbarStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#007bff', // Bootstrap primary color for the navbar
        borderRadius: '5px',
        padding: '10px 20px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', // Deeper shadow for more depth
        marginBottom: '20px',
    };

    const linkStyle = {
        margin: '0 15px', // Space between links
        textDecoration: 'none',
        color: '#fff', // White text for better visibility on dark background
        fontSize: '18px',
        padding: '10px 20px', // Adjusted padding for a button-like appearance
        borderRadius: '5px',
        transition: 'background-color 0.3s, transform 0.3s', // Smooth transitions
        backgroundColor: 'transparent', // Default background
    };

    const hoverStyle = {
        backgroundColor: '#0056b3', // Darker shade on hover
        transform: 'scale(1.05)', // Slightly grow the button on hover
    };

    const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = hoverStyle.backgroundColor;
        e.target.style.transform = hoverStyle.transform;
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.transform = 'scale(1)';
    };

    return (
        <div style={containerStyle}>
            <h1>Stations</h1>
            <div style={navbarStyle}>
                <Link
                    to="/add_stations"
                    style={linkStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    Add Station
                </Link>
                {/* You can add more links here if needed */}
            </div>

            {/* Render the respective component based on the route */}
            <Routes>
            <Route path="/add_stations" 
                 element={<ProtectedRoute element={<AddStations />} allowedRoles={['admin']} />} />
            </Routes>
        </div>
    );
}

export default Stations;
