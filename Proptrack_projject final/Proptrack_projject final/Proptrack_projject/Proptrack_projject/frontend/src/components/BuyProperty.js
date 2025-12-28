import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PropertyPage.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BuyProperty = () => {
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterArea, setFilterArea] = useState('');

  // ✅ Fetch properties from backend
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // Humne backend mein 'isDeleted: false' ka logic pehle hi laga diya hai
        const res = await axios.get("http://localhost:5000/api/properties/available");
        
        // Backend se 'Sell' ya 'Buy' dono aa sakte hain depend karta hai aapne kya save kiya
        const buyProperties = res.data.filter(
          (p) => p.sellingType.toLowerCase() === 'buy' || p.sellingType.toLowerCase() === 'sell'
        );
        
        setAllProperties(buyProperties);
        setFilteredProperties(buyProperties);
      } catch (err) {
        console.error('Failed to fetch properties', err);
      }
    };

    fetchProperties();
  }, []);

  // 🔎 Filter logic (Peformance optimized)
  const handleSearch = () => {
    const results = allProperties.filter((property) => {
      const matchesTitle = property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = filterLocation
        ? property.location.toLowerCase().includes(filterLocation.toLowerCase())
        : true;
      
      // Price Logic
      let matchesPrice = true;
      if (filterPrice === '<50') matchesPrice = property.price < 5000000;
      else if (filterPrice === '50-100') matchesPrice = property.price >= 5000000 && property.price <= 10000000;
      else if (filterPrice === '>100') matchesPrice = property.price > 10000000;

      // Area Logic
      let matchesArea = true;
      if (filterArea === '<5') matchesArea = property.area < 5;
      else if (filterArea === '5-10') matchesArea = property.area >= 5 && property.area <= 10;
      else if (filterArea === '>10') matchesArea = property.area > 10;

      return matchesTitle && matchesLocation && matchesPrice && matchesArea;
    });

    setFilteredProperties(results);
  };

  const handleCardClick = (property) => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login first to view property details.');
      return;
    }
    localStorage.setItem('selectedProperty', JSON.stringify(property));
    navigate(`/property/${property.title.replace(/\s+/g, '-')}`);
  };

  return (
    <div className="property-page container">
      <h1 className="property-heading">Buy Property</h1>
      <p className="property-description">
        Find your perfect home using filters like price, area, and location.
      </p>

      {/* 🔍 Filters Section */}
      <div className="search-filter-section row g-2 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-2">
          <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="form-select">
            <option value="">All Locations</option>
            <option value="G-11">G-11</option>
            <option value="F-10">F-10</option>
            <option value="Bahria Town">Bahria Town</option>
            <option value="DHA">DHA</option>
          </select>
        </div>
        <div className="col-md-2">
          <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)} className="form-select">
            <option value="">Price Range</option>
            <option value="<50">Under 50 Lac</option>
            <option value="50-100">50 Lac – 1 Crore</option>
            <option value=">100">Above 1 Crore</option>
          </select>
        </div>
        <div className="col-md-2">
          <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} className="form-select">
            <option value="">Area Size</option>
            <option value="<5">Under 5 Marla</option>
            <option value="5-10">5 – 10 Marla</option>
            <option value=">10">Above 10 Marla</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-success w-100" onClick={handleSearch}>Search</button>
        </div>
      </div>

      {/* 📦 Property Cards Grid */}
      <div className="row">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div className="col-md-4 mb-4" key={property._id}>
              <div className="property-card shadow-sm" onClick={() => handleCardClick(property)}>
                <div className="image-container">
                  <img
                    src={`http://localhost:5000/uploads/${property.image}`}
                    alt={property.title}
                    className="property-image"
                  />
                  <span className="badge bg-success payment-badge">{property.paymentMethod}</span>
                </div>
                <div className="p-3">
                  <h3 className="h5 text-truncate">{property.title}</h3>
                  <p className="price text-primary fw-bold">Rs. {(property.price / 100000).toFixed(2)} Lac</p>
                  <p className="mb-1"><i className="bi bi-geo-alt"></i> {property.location}, {property.city}</p>
                  <div className="d-flex justify-content-between text-muted small">
                    <span>{property.area} Marla</span>
                    <span>{property.bedrooms} Beds | {property.bathrooms} Baths</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center mt-5">
            <h4>No properties found matching your criteria.</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyProperty;