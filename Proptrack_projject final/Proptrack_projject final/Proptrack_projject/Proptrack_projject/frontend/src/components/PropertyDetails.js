import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PropertyDetails.css';

const PropertyDetail = () => {
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const selected = JSON.parse(localStorage.getItem('selectedProperty'));
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser) setUser(currentUser);

    if (selected && selected._id) {
      axios.get(`http://localhost:5000/api/properties/${selected._id}`)
        .then(res => setProperty(res.data))
        .catch(err => console.error('Error fetching property:', err));
    }
  }, []);

  const handleBookingRequest = async () => {
    if (!user) {
      alert('Please login first.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/bookings', {
        propertyId: property._id,
        buyerEmail: user.email,
        sellerEmail: property.ownerEmail
      });
      alert(property.sellingType === 'Rent' ? 'Rent request sent to owner!' : 'Booking request sent to seller!');
    } catch (error) {
      console.error('Booking request failed', error);
      alert('Something went wrong.');
    }
  };

  const handleEdit = () => {
    localStorage.setItem('propertyToEdit', JSON.stringify(property));
    navigate('/edit-property');
  };

  const handleDelete = async () => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this property?');
      if (!confirmDelete) return;

      const res = await axios.delete(`http://localhost:5000/api/properties/${property._id}`);
      if (res.status === 200) {
        alert('Property deleted successfully');
        navigate('/sell');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to delete property');
    }
  };

  if (!property) return <div className="loading">Loading property details...</div>;

  const imageUrl = `http://localhost:5000/uploads/${property.image}`;

  return (
    <div className="detail-container">
      <div className="image-section">
        <img src={imageUrl} alt={property.title} className="detail-image" />
      </div>

      <div className="info-section">
        {/* Seller buttons */}
        {user?.roles?.includes('seller') && user.email === property.ownerEmail && (
          <div className="seller-actions">
            <button className="edit-btn" onClick={handleEdit}>Edit</button>
            <button className="delete-btn" onClick={handleDelete}>Delete</button>
          </div>
        )}

        <h2>{property.title}</h2>
        <p className="price-tag">
          <strong>Price:</strong> Rs. {(property.price / 100000).toFixed(2)} Lac 
          {property.sellingType === 'Rent' && <span className="per-month"> / month</span>}
        </p>
        
        <div className="details-grid">
          <p><strong>Location:</strong> {property.location}</p>
          <p><strong>City:</strong> {property.city}</p>
          <p><strong>Area:</strong> {property.area} Marla</p>
          <p><strong>Selling Type:</strong> {property.sellingType}</p>
          <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
          <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
          
          {/* 🟢 Naye Fields ki Display */}
          <p><strong>Payment Method:</strong> {property.paymentMethod || 'Cash'}</p>
          
          {property.sellingType === 'Rent' && (
            <p><strong>Rent Duration:</strong> {property.rentDuration} Months</p>
          )}
        </div>

        <p className="description"><strong>Description:</strong> {property.description}</p>

        <hr />

        {/* ✅ Conditional Button for Buyer */}
        {user?.roles?.includes('buyer') && property.status !== 'booked' && (
          <button className="btn-booking" onClick={handleBookingRequest}>
            {property.sellingType === 'Rent' ? 'Rent This Property' : 'Buy Now / Book Now'}
          </button>
        )}

        {/* Show Booked label if property is booked */}
        {property.status === 'booked' && (
          <div className="booked-badge">Status: Booked / Sold</div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;