import React, { useEffect, useState } from 'react';
import './PropertyPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SellerChat from './SellerChat'; 

const SellProperty = () => {
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const fetchProperties = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user?.email;

    if (email) {
      // Backend route jo seller ki specific properties lata hai
      axios
        .get(`http://localhost:5000/api/properties/seller/${email}`)
        .then((res) => {
          // Sirf wo properties dikhayen jo soft-delete nahi hui
          const activeProperties = res.data.filter(p => !p.isDeleted);
          setProperties(activeProperties);
          setFilteredProperties(activeProperties);
        })
        .catch((err) => {
          console.error('Error fetching properties:', err);
        });
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.roles.includes('seller')) {
      alert("Access Denied. Only sellers can view this dashboard.");
      navigate("/login");
      return;
    }
    fetchProperties();
  }, [navigate]);

  const handleSearch = () => {
    const results = properties.filter((property) => {
      const matchesTitle = property.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = filterLocation
        ? property.location.toLowerCase().includes(filterLocation.toLowerCase())
        : true;
      return matchesTitle && matchesLocation;
    });
    setFilteredProperties(results);
  };

  const handleCardClick = (property) => {
    localStorage.setItem('selectedProperty', JSON.stringify(property));
    navigate('/property/detail');
  };

  const handleAddProperty = () => {
    navigate('/add-property');
  };

  return (
    <div className="property-page container" style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pt-4">
        <div>
          <h1 className="property-heading">Seller Dashboard</h1>
          <p className="property-description">Manage your listings and track booking requests.</p>
        </div>
        <button className="btn btn-success shadow-sm" onClick={handleAddProperty}>
          + List New Property
        </button>
      </div>

      {/* 🔍 Mini Filters Section */}
      <div className="search-filter-section row g-2 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            placeholder="Search your listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="col-md-3">
          <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="form-select">
            <option value="">All Locations</option>
            <option value="G-11">G-11</option>
            <option value="F-10">F-10</option>
            <option value="Bahria Town">Bahria Town</option>
          </select>
        </div>
        <div className="col-md-1">
          <button className="btn btn-primary w-100" onClick={handleSearch}>Find</button>
        </div>
      </div>

      {/* 📦 Seller Property Cards */}
      <div className="row">
        {filteredProperties.length === 0 ? (
          <div className="col-12 text-center py-5">
            <p className="text-muted">You haven't listed any properties yet.</p>
          </div>
        ) : (
          filteredProperties.map((property) => (
            <div className="col-md-4 mb-4" key={property._id}>
              <div className={`property-card shadow-sm ${property.status === 'booked' ? 'border-danger' : ''}`}>
                <div className="position-relative">
                  <img
                    src={`http://localhost:5000/uploads/${property.image}`}
                    alt="Property"
                    className="property-image"
                    onClick={() => handleCardClick(property)}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Status Badge */}
                  <span className={`badge position-absolute top-0 start-0 m-2 ${property.status === 'booked' ? 'bg-danger' : 'bg-success'}`}>
                    {property.status.toUpperCase()}
                  </span>
                  <span className="badge bg-dark position-absolute top-0 end-0 m-2">
                    {property.sellingType}
                  </span>
                </div>
                
                <div className="p-3">
                  <h3 className="h5 text-truncate">{property.title}</h3>
                  <p className="fw-bold text-primary mb-1">
                    Rs. {property.sellingType === 'Rent' ? `${property.price.toLocaleString()} /mo` : `${(property.price / 100000).toFixed(2)} Lac`}
                  </p>
                  <p className="small text-muted">{property.location}</p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleCardClick(property)}>
                      View / Manage
                    </button>
                    <span className="small text-muted">{property.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <SellerChat /> 
    </div>
  );
};

export default SellProperty;