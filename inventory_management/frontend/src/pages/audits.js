import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import Select from 'react-select';
import LoadingAnimation from '../components/loading';

export default function Audits() {
    const [audits, setAudits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Track if editing
    const [currentAuditId, setCurrentAuditId] = useState(null); // Store current audit ID
    const [formData, setFormData] = useState({
        asset_id: '',
        location: '',
        status: '',
        utilization: '',
        comments: '',
    });
    const [assets, setAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState({ key: 'audit_date', order: 'asc' });
    const [deleteAuditId, setDeleteAuditId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };
    const handleSortChange = (key) => {
        setSortCriteria(prevCriteria => ({
            key,
            order: prevCriteria.key === key && prevCriteria.order === 'asc' ? 'desc' : 'asc'
        }));
    };
    const getSortIndicator = (key) => {
        if (sortCriteria.key === key) {
            return sortCriteria.order === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };
    const filteredAndSortedAudits = useMemo(() => {
        const filteredAudits = audits.filter(audit =>
            audit.asset_id.toLowerCase().includes(searchTerm) ||
            audit.auditor_name.toLowerCase().includes(searchTerm) ||
            audit.location.toLowerCase().includes(searchTerm) ||
            audit.status.toLowerCase().includes(searchTerm) ||
            audit.utilization.toLowerCase().includes(searchTerm)
        );

        return filteredAudits.sort((a, b) => {
            const aValue = a[sortCriteria.key];
            const bValue = b[sortCriteria.key];

            if (aValue < bValue) return sortCriteria.order === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortCriteria.order === 'asc' ? 1 : -1;
            return 0;
        });
    }, [audits, searchTerm, sortCriteria]);

    // Fetch audits
    useEffect(() => {
        const fetchAudits = async () => {
            setLoading(true); // Start loading
            try {
                const response = await axios.get('http://localhost:8000/api/audits/');
                setAudits(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchAudits();
    }, []);

    // Fetch assets for the dropdown
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/get_asset_ids/');
                setAssets(response.data.map(asset => ({
                    value: asset.asset_id,
                    label: `${asset.asset_id}`
                })));
            } catch (err) {
                setError('Error fetching asset data');
            }
        };
        fetchAssets();
    }, []); // Only runs once on component mount

    // Optimized change handler using useCallback
    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleAssetSelect = useCallback((selectedOption) => {
        setFormData(prevData => ({
            ...prevData,
            asset_id: selectedOption ? selectedOption.value : '',
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auditorName = sessionStorage.getItem('username');
        const payload = {
            ...formData,
            auditor_name: auditorName,
        };

        try {
            // Fetch the list of assets to get actual asset details for comparison
            const assetResponse = await axios.get('http://localhost:8000/api/get_asset_ids/'); //gets assetdetails actually.
            const assets = assetResponse.data;

            // Find the asset by the asset_id in formData
            const actualAsset = assets.find(asset => asset.asset_id === formData.asset_id);

            // Check if the asset exists and perform the discrepancy check
            let hasDiscrepancy = false;
            if (actualAsset) {
                hasDiscrepancy = (
                    formData.location.toLowerCase() !== actualAsset.location.toLowerCase() ||
                    formData.status.toLowerCase() !== actualAsset.status.toLowerCase()
                    // formData.utilization !== actualAsset.utilization    for future use
                );
            } else {
                // If the asset does not exist in the backend, consider it a discrepancy
                hasDiscrepancy = true;
            }
            if (hasDiscrepancy) {
                alert('Discrepancy detected!');
            }
            // Set the discrepancy flag in the payload
            payload.discrepancy = hasDiscrepancy;

            if (isEditing) {
                // Update existing audit
                await axios.put(`http://localhost:8000/api/audits/update/${currentAuditId}/`, payload);
                setAudits(prevAudits => prevAudits.map(audit =>
                    (audit.id === currentAuditId ? { ...audit, ...formData, discrepancy: hasDiscrepancy } : audit)
                ));
                alert('Audit updated successfully!');
            } else {
                // Create new audit with discrepancy check
                const response = await axios.post('http://localhost:8000/api/audits/create/', payload);
                setAudits(prevAudits => [...prevAudits, response.data]);
                alert('Audit created successfully!');
            }

            // Reset the form and state
            setShowModal(false);
            setFormData({
                asset_id: '',
                location: '',
                status: '',
                utilization: '',
                comments: '',
                discrepancy: false,
            });
            setIsEditing(false); // Reset editing state
            window.location.reload(); // Refresh the page
        } catch (err) {
            console.error("Error submitting form:", err.response.data);
        }
    };

    const handleDeleteConfirmation = (auditId) => {
        setDeleteAuditId(auditId);
        setShowDeleteModal(true);
    };
    // Handle delete audit
    const confirmDelete = async () => {
        if (deleteAuditId) {
            try {
                await axios.delete(`http://localhost:8000/api/audits/delete/${deleteAuditId}/`);
                setAudits(prevAudits => prevAudits.filter(audit => audit.id !== deleteAuditId));
                alert('Audit deleted successfully.');
            } catch (err) {
                alert('Error occurred while deleting the audit.');
            } finally {
                setShowDeleteModal(false);
                setDeleteAuditId(null);
            }
        }
    };

    const handleEdit = (audit) => {
        setShowModal(true);
        setIsEditing(true);
        setCurrentAuditId(audit.asset_id); // Set the current audit ID for updates
        setFormData({
            asset_id: audit.asset_id,
            location: audit.location,
            status: audit.status,
            utilization: audit.utilization,
            comments: audit.comments,
            discrepancy: audit.discrepancy,
        });
    };

    if (loading) return <LoadingAnimation />;

    return (
        <div className="container mt-5">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Audited Assets</h1>
                <Button variant="success" onClick={() => {
                    setShowModal(true);
                    setIsEditing(false);
                }}>
                    Add New Audit
                </Button>
            </div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search audits..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Edit Audit' : 'Add Audit'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="asset_id">Asset ID:</label>
                            <Select
                                options={assets}
                                onChange={handleAssetSelect}
                                isSearchable={true}
                                placeholder="Select an Asset by ID..."
                                value={assets.find(asset => asset.value === formData.asset_id)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="location">Location:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select
                                className="form-control"
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="ACTIVE">ACTIVE</option>
                                <option value="INACTIVE">INACTIVE</option>
                                <option value="UNDER_REPAIR">UNDER_REPAIR</option>
                                <option value="DECOMMISSIONED">DECOMMISSIONED</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="utilization">Utilization:</label>
                            <select
                                className="form-control"
                                id="utilization"
                                name="utilization"
                                value={formData.utilization}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Utilization</option>
                                <option value="IN_USE">IN_USE</option>
                                <option value="IDLE">IDLE</option>
                                <option value="UNAVAILABLE">UNAVAILABLE</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="comments">Comments:</label>
                            <textarea
                                className="form-control"
                                id="comments"
                                name="comments"
                                value={formData.comments}
                                onChange={handleInputChange}
                            />
                        </div>
                        <Button style={{ margin: '10px 0' }} type="submit" variant="outline-primary">{isEditing ? 'Update Audit' : 'Submit Audit'}</Button>
                    </form>
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this audit? {deleteAuditId}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDelete}>Delete</Button>
                </Modal.Footer>
            </Modal>

            <table className="table table-striped table-bordered mt-4">
                <thead className="thead-dark">
                    <tr >
                        <th className='cursor-pointer' onClick={() => handleSortChange('audit_date')}>Audit Date {getSortIndicator('audit_date')}</th>
                        <th className='cursor-pointer' onClick={() => handleSortChange('asset_id')}>Asset ID {getSortIndicator('asset_id')}</th>
                        <th className='cursor-pointer' onClick={() => handleSortChange('auditor_name')}>Auditor Name {getSortIndicator('auditor_name')}</th>
                        <th className='cursor-pointer' onClick={() => handleSortChange('location')}>Location {getSortIndicator('location')}</th>
                        <th className='cursor-pointer' onClick={() => handleSortChange('status')}>Status {getSortIndicator('status')}</th>
                        <th className='cursor-pointer' onClick={() => handleSortChange('utilization')}>Utilization {getSortIndicator('utilization')}</th>
                        <th>Comments</th>
                        <th className='cursor-pointer' onClick={() => handleSortChange('discrepancy')}>Discrepancy {getSortIndicator('discrepancy')}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredAndSortedAudits.map((audit) => (
                        <tr key={audit.id}>
                            <td>{new Date(audit.audit_date).toLocaleString()}</td>
                            <td>{audit.asset_id}</td>
                            <td>{audit.auditor_name}</td>
                            <td>{audit.location}</td>
                            <td>{audit.status}</td>
                            <td>{audit.utilization}</td>
                            <td>{audit.comments}</td>
                            <td>{audit.discrepancy ? 'Yes' : 'No'}</td>
                            <td>
                                <Button style={{ margin: '5px' }} onClick={() => handleEdit(audit)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteConfirmation(audit.asset_id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}