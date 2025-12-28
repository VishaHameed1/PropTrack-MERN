import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingRequests = () => {
  const [pendingBookings, setPendingBookings] = useState([]);


  useEffect(() => {
  const fetchRequests = async () => {
    try {
      const sellerEmail = JSON.parse(localStorage.getItem('user')).email; // ✅ This defines sellerEmail
      const res = await axios.get(`http://localhost:5000/api/bookings/pending/${sellerEmail}`);
setPendingBookings(res.data);
    } catch (err) {
      console.error('Failed to fetch booking requests', err);
    }
  };

  fetchRequests();
}, []);



  const handleConfirm = async (bookingId) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/confirm/${bookingId}`);
      setPendingBookings(prev => prev.filter(b => b._id !== bookingId));
    } catch (err) {
      console.error('Error confirming booking', err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Pending Booking Requests</h2>
      {pendingBookings.map((booking) => (
        <div key={booking._id} className="card mb-3 p-3">
          <h5>{booking.propertyId.title}</h5>
          <p>Location: {booking.propertyId.location}</p>
          <p>Price: Rs. {(booking.propertyId.price / 100000).toFixed(2)} Lac</p>
          <p>Buyer Email: {booking.buyerEmail}</p>
          <button className="btn btn-success" onClick={() => handleConfirm(booking._id)}>
            Confirm Booking
          </button>
        </div>
      ))}
    </div>
  );
};

export default BookingRequests;
