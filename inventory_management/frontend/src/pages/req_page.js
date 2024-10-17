import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Select from "react-select";
import axios from "axios";

export default function Requests() {
    const [showAssetReqModal, setShowAssetReqModal] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [assetOptions, setAssetOptions] = useState([]);
    const [assetDetails, setAssetDetails] = useState({});
    const [currentRequest, setCurrentRequest] = useState({
        assetName: null,
        noOfItems: ''
    });
    const [requestingAssets, setRequestingAssets] = useState([]);
    const [filteredAssets, setFilteredAssets] = useState([]);
    const [availabilityInfo, setAvailabilityInfo] = useState({});
    const [filter, setFilter] = useState('');
    const stationName = sessionStorage.getItem("station_name");
    const user_position = sessionStorage.getItem("position");
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    console.log("availabilityInfo :", availabilityInfo);

    useEffect(() => {
        axios.get('http://localhost:8000/api/get_asset_ids/')
            .then(response => {
                const options = response.data.map(asset => ({
                    value: asset.asset_id,
                    label: asset.name
                }));
                setAssetOptions(options);

                const assetMap = response.data.reduce((acc, asset) => {
                    acc[asset.asset_id] = asset.name;
                    return acc;
                }, {});
                setAssetDetails(assetMap);
            })
            .catch(error => console.error("Error fetching asset data:", error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8000/api/asset_requests/')
            .then(response => {
                const groupedAssets = response.data.reduce((acc, current) => {
                    const { requesting_station, asset, quantity, request_date, request_id } = current;
                    if (!acc[requesting_station]) {
                        acc[requesting_station] = [];
                    }
                    const assetName = assetDetails[asset] || "Unknown Asset";
                    acc[requesting_station].push({ assetName, quantity, request_date, asset, request_id });
                    return acc;
                }, {});
                setRequestingAssets(groupedAssets);
                setFilteredAssets(groupedAssets);
            })
            .catch(error => console.error("Error fetching requested assets:", error));
    }, [assetDetails]);

    useEffect(() => {
        const filtered = {};
        Object.entries(requestingAssets).forEach(([station, assets]) => {
            const matchedAssets = assets.filter(asset =>
                asset.assetName.toLowerCase().includes(filter.toLowerCase())
            );
            if (matchedAssets.length > 0) {
                filtered[station] = matchedAssets;
            }
        });
        setFilteredAssets(filtered);
    }, [filter, requestingAssets]);

    const handleDeleteRequest = async (requestId) => {
        if (!window.confirm("Are you sure you want to delete this request?")) {
            return;
        }
        try {
            const response = await axios.delete(`http://localhost:8000/api/asset_requests/${requestId}/`);
            if (response.status === 204) {
                alert("Request Deleted Successfully");
            } else {
                alert("Failed to delete the request. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting the request:", error);
            alert("Failed to delete the request. Please try again.");
        }
    };

    const handleCheckAvailability = async (assetName) => {
        setLoading(true);
        try {
            const currentStation = stationName;
            const response = await axios.get(`http://localhost:8000/api/check_asset_availability/`, {
                params: {
                    asset_name: assetName,
                    station_name: currentStation
                }
            });

            if (response.status === 200) {
                setAvailabilityInfo(response.data);
                setShowAvailabilityModal(true);
            } else {
                alert("Failed to check availability. Please try again.");
            }
        } catch (error) {
            console.error("Error checking availability:", error);
            // Check if the error response has a message and display it
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("Failed to check availability. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleProvide = (asset_id) => {
        console.log("Asset ID:", asset_id);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/asset_requests/', {
                asset: currentRequest.assetName.value,
                requesting_station: stationName,
                quantity: currentRequest.noOfItems,
            });
            alert("Request Submitted Successfully");
            setCurrentRequest({ assetName: null, noOfItems: '' });
            setShowAssetReqModal(false);
        } catch (error) {
            console.error("Error submitting the request:", error);
        }
    };

    return (
        <div>
            <h1>Requests Page</h1>
            <input
                type="text"
                placeholder="Filter assets..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-control mb-3"
            />
            <Button onClick={() => setShowAssetReqModal(true)}>Request Assets</Button>

            <Modal show={showAssetReqModal} onHide={() => setShowAssetReqModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Request Assets</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Asset Name</label>
                            <Select
                                placeholder="Select the asset name..."
                                value={currentRequest.assetName}
                                options={assetOptions}
                                onChange={(selectedOption) =>
                                    setCurrentRequest(prev => ({ ...prev, assetName: selectedOption }))
                                }
                                isSearchable
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>No Of Items</label>
                            <input
                                type="number"
                                className="form-control"
                                value={currentRequest.noOfItems}
                                onChange={(e) =>
                                    setCurrentRequest(prev => ({ ...prev, noOfItems: e.target.value }))
                                }
                                required
                            />
                        </div>
                        <Button
                            variant="outline-primary"
                            type="submit"
                            style={{ marginTop: 10 }}
                            disabled={!currentRequest.assetName || !currentRequest.noOfItems || loading}
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAssetReqModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showAvailabilityModal} onHide={() => setShowAvailabilityModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Asset Availability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {availabilityInfo.length > 0 ? (
                        availabilityInfo.map((asset, index) => (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <p>Asset ID: {asset.name}</p>
                                <p>Asset Type: {asset.asset_type}</p>
                                <p>Status: {asset.status}</p>
                                <Button variant="outline-dark" onClick={() => handleProvide(asset.asset_id)}>Provide</Button>
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No availability information found.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAvailabilityModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            <div>
                {Object.keys(filteredAssets).length === 0 ? (
                    <p>No asset requests found.</p>
                ) : (
                    <table className="table table-striped table-bordered mt-4">
                        <thead className="thead-dark">
                            <tr>
                                <th>Requested Station</th>
                                <th>Requested Quantity</th>
                                <th>Requested Asset</th>
                                <th>Request Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(filteredAssets).map(([station, assets]) =>
                                assets.map((asset, assetIndex) => (
                                    <tr key={`${station}-${asset.request_id}-${assetIndex}`}>
                                        {assetIndex === 0 ? (
                                            <td rowSpan={assets.length}>{station}</td>
                                        ) : null}
                                        <td>{asset.quantity}</td>
                                        <td>{asset.assetName}</td>
                                        <td>{asset.request_date}</td>
                                        <td>
                                            <Button
                                                variant="outline-primary"
                                                onClick={() => handleCheckAvailability(asset.assetName)}
                                                disabled={loading}
                                            >
                                                {loading ? "Checking..." : "Check Availability"}
                                            </Button>
                                            {user_position === "admin" && (
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => handleDeleteRequest(asset.request_id)}
                                                    style={{ marginLeft: 10 }}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? "Deleting..." : "Delete Request"}
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
