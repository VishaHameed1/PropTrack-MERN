import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PropertyPage.css';
import { useNavigate } from 'react-router-dom';

const RentProperty = () => {
  const navigate = useNavigate();

  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterPrice, setFilterPrice] = useState('');
  const [filterArea, setFilterArea] = useState('');

  // ✅ Fetch available rent properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        // 'available' endpoint use karein jo soft-deleted aur booked properties ko filter karta hai
        const res = await axios.get('http://localhost:5000/api/properties/available');
        const rentProperties = res.data.filter(
          (property) => property.sellingType.toLowerCase() === 'rent'
        );
        setAllProperties(rentProperties);
        setFilteredProperties(rentProperties);
      } catch (error) {
        console.error('Failed to fetch properties', error);
      }
    };

    fetchProperties();
  }, []);

  // 🔎 Rent-specific filter logic
  const handleSearch = () => {
    const results = allProperties.filter((property) => {
      const matchesTitle = property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = filterLocation
        ? property.location.toLowerCase().includes(filterLocation.toLowerCase())
        : true;

      // Adjusted Price logic for Rent (in Thousands/Lac)
      let matchesPrice = true;
      if (filterPrice === '<30k') matchesPrice = property.price < 30000;
      else if (filterPrice === '30k-70k') matchesPrice = property.price >= 30000 && property.price <= 70000;
      else if (filterPrice === '>70k') matchesPrice = property.price > 70000;

      const matchesArea =
        filterArea === ''
          ? true
          : filterArea === '<5'
          ? property.area < 5
          : filterArea === '5-10'
          ? property.area >= 5 && property.area <= 10
          : filterArea === '>10'
          ? property.area > 10
          : true;

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
      <h1 className="property-heading">Properties for Rent</h1>
      <p className="property-description">
        Browse affordable rental homes and apartments with flexible monthly plans.
      </p>

      {/* 🔍 Search & Filters */}
      <div className="search-filter-section row g-2 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="Search rental title..."
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
          </select>
        </div>

        <div className="col-md-2">
          <select value={filterPrice} onChange={(e) => setFilterPrice(e.target.value)} className="form-select">
            <option value="">Monthly Rent</option>
            <option value="<30k">Under 30k</option>
            <option value="30k-70k">30k - 70k</option>
            <option value=">70k">Above 70k</option>
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

      {/* 📦 Rent Property Cards */}
      <div className="row">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div className="col-md-4 mb-4" key={property._id}>
              <div className="property-card shadow-sm h-100" onClick={() => handleCardClick(property)}>
                <div className="position-relative">
                  <img
                    src={`http://localhost:5000/uploads/${property.image}`}
                    alt={property.title}
                    className="property-image"
                  />
                  <span className="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                    Rent: {property.rentDuration} Mo.
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="h5 text-truncate">{property.title}</h3>
                  <p className="price text-success fw-bold">Rs. {property.price.toLocaleString()} / month</p>
                  <p className="small mb-1"><i className="bi bi-geo-alt"></i> {property.location}</p>
                  <div className="d-flex justify-content-between text-muted small mt-2">
                    <span>{property.area} Marla</span>
                    <span>{property.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center mt-5">
            <h3>No rental properties found.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default RentProperty;