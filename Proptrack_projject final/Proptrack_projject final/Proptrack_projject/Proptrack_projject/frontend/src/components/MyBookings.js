import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [myBookings, setMyBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const buyerEmail = user?.email;

        const res = await axios.get(`http://localhost:5000/api/bookings/buyer/${buyerEmail}`);

        // Filter only confirmed bookings
        const confirmedBookings = res.data.filter(b => b.status === 'booked');
        setMyBookings(confirmedBookings);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mt-4">
      <h2>My Bookings</h2>
      {myBookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Property</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {myBookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.propertyId?.title || booking.propertyId}</td>
                <td>
                  <span className="badge bg-success">Booked</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyBookings;
