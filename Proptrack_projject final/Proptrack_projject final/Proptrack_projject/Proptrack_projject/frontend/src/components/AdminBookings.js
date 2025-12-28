import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/bookings')
      .then(res => setBookings(res.data))
      .catch(err => console.error("Error fetching bookings", err));
  }, []);

  const handleConfirm = (bookingId) => {
    axios.put(`http://localhost:5000/api/bookings/${bookingId}`, { status: "Confirmed" })
      .then(() => {
        alert("Booking confirmed.");
        // Refresh list
        setBookings(prev =>
          prev.map(b => b._id === bookingId ? { ...b, status: "Confirmed" } : b)
        );
      });
  };

  const handleDeny = (bookingId) => {
    axios.put(`http://localhost:5000/api/bookings/${bookingId}`, { status: "Denied" })
      .then(() => {
        alert("Booking denied.");
        setBookings(prev =>
          prev.map(b => b._id === bookingId ? { ...b, status: "Denied" } : b)
        );
      });
  };

  return (
    <div className="container mt-4">
      <h2>All Property Bookings</h2>
      {bookings.map(booking => (
        <div key={booking._id} className="card mb-2 p-3">
          <p><strong>User:</strong> {booking.userEmail}</p>
          <p><strong>Property:</strong> {booking.propertyId}</p>
          <p><strong>Status:</strong> {booking.status}</p>
          {booking.status === 'Pending' && (
            <div>
              <button className="btn btn-success me-2" onClick={() => handleConfirm(booking._id)}>
                Confirm
              </button>
              <button className="btn btn-danger" onClick={() => handleDeny(booking._id)}>
                Deny
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminBookings;
