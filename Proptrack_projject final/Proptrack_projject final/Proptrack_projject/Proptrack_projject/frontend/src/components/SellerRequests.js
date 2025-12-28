import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerRequests = () => {
  const [requests, setRequests] = useState([]);
  const seller = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(`/api/bookings/seller/${seller._id}`);
        setRequests(res.data);
      } catch (err) {
        console.error('Error fetching booking requests:', err);
      }
    };

    if (seller?._id) {
      fetchRequests();
    }
  }, [seller]);

  const handleAction = async (bookingId, status) => {
    try {
      const res = await axios.put(`/api/bookings/${bookingId}`, { status });
      if (res.data.success) {
        setRequests(prev =>
          prev.map(req =>
            req._id === bookingId ? { ...req, status } : req
          )
        );
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Buyer Booking Requests</h2>
      {requests.length === 0 ? (
        <p>No booking requests yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '15px', borderRadius: '10px' }}>
            <p><strong>Property Title:</strong> {req.property?.title}</p>
            <p><strong>Buyer Name:</strong> {req.buyer?.name}</p>
            <p><strong>Status:</strong> {req.status}</p>
            {req.status === 'pending' && (
              <div>
                <button onClick={() => handleAction(req._id, 'confirmed')} style={{ marginRight: '10px' }}>
                  Confirm
                </button>
                <button onClick={() => handleAction(req._id, 'denied')}>
                  Deny
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SellerRequests;
