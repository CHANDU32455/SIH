import { Link, Route, Routes } from "react-router-dom";
import AssetForm from "../pages/add_assests";
import BulkAssetUpload from "../pages/bulk_assets_upload";
import ProtectedRoute from "../ProtectedRoute";
import { useEffect, useState } from "react";

function Assets() {
    const [position, setPosition] = useState("");

    // Get position from sessionStorage when component mounts
    useEffect(() => {
        const storedPosition = sessionStorage.getItem('position');
        if (storedPosition) {
            setPosition(storedPosition);
        }
    }, []);

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
            <h1>Assets</h1>
            <div style={navbarStyle}>
                {/* Show 'Add Assets' to both Admin and Station Master */}
                <Link
                    to="/add_assests"
                    style={linkStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    Add Assets
                </Link>

                {/* Show 'Add Bulk Assets' only to Admin */}
                {position === 'admin' && (
                    <Link
                        to="/bulk_assets_upload"
                        style={linkStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        Add Bulk Assets
                    </Link>
                )}
            </div>

            {/* Render the respective component based on the route */}
            <Routes>
                <Route
                    path="/add_assests"
                    element={<ProtectedRoute element={<AssetForm />} allowedRoles={['admin', 'stationmaster']} />}
                />
                <Route
                    path="/bulk_assets_upload"
                    element={<ProtectedRoute element={<BulkAssetUpload />} allowedRoles={['admin']} />}
                />
            </Routes>
        </div>
    );
}

export default Assets;
