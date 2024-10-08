import React, { useState } from 'react';
import axios from 'axios';
import '../styles/bulk_assets_upload.css';

const BulkAssetUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle form submission for file upload
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please upload a JSON file.');
            return;
        }

        // Read the file content
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonContent = JSON.parse(e.target.result);
                
                // Log the JSON content for debugging
                console.log('JSON Content:', jsonContent);

                // Send POST request to Django API for bulk asset upload
                const response = await axios.post('http://localhost:8000/api/bulk_assets/', jsonContent, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 201) {
                    setMessage('Assets uploaded successfully!');
                }
            } catch (error) {
                // Improved error handling
                if (error.response) {
                    console.error('Error response:', error.response.data);
                    setMessage('Error uploading assets: ' + JSON.stringify(error.response.data));
                } else {
                    setMessage('Error uploading assets: ' + error.message);
                }
            }
        };

        reader.readAsText(file);  // Read file content as text
    };

    return (
        <div id="bulk-asset-upload-container">
            <h2>Bulk Asset Upload</h2>
            <div className="upload-section">
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                />
                <button onClick={handleFileUpload}>Upload JSON File</button>
            </div>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default BulkAssetUpload;
