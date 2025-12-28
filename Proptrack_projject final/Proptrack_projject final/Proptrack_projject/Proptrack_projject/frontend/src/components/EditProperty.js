import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProperty.css';

const EditProperty = () => {
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    area: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    sellingType: ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('propertyToEdit'));
    if (saved) {
      setProperty(saved);
      setFormData({
        title: saved.title || '',
        price: saved.price || '',
        location: saved.location || '',
        area: saved.area || '',
        city: saved.city || '',
        bedrooms: saved.bedrooms || '',
        bathrooms: saved.bathrooms || '',
        description: saved.description || '',
        sellingType: saved.sellingType || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!property?._id) {
      alert('No property selected to update');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/properties/${property._id}`,
        formData
      );
      alert('Property updated successfully');
      window.location.href = '/sell';
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update property');
    }
  };

  if (!property) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-container">
      <h2>Edit Property</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
        <input name="price" value={formData.price} onChange={handleChange} placeholder="Price" type="number" required />
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
        <input name="area" value={formData.area} onChange={handleChange} placeholder="Area (Marla)" type="number" />
        <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
        <input name="bedrooms" value={formData.bedrooms} onChange={handleChange} placeholder="Bedrooms" type="number" />
        <input name="bathrooms" value={formData.bathrooms} onChange={handleChange} placeholder="Bathrooms" type="number" />
        <input name="sellingType" value={formData.sellingType} onChange={handleChange} placeholder="Selling Type" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
        <button type="submit">Update Property</button>
      </form>
    </div>
  );
};

export default EditProperty;
