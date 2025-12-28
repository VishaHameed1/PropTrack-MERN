import React, { useState } from 'react';
import axios from 'axios';
import './AddProperty.css';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    ownerEmail: '',
    area: '',
    sellingType: 'Sell', // 'Sell' (Buy) or 'Rent'
    description: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    imageFile: null,
    // Naye fields
    rentDuration: '', 
    paymentMethod: 'Cash', 
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('location', formData.location);
    data.append('ownerEmail', formData.ownerEmail);
    data.append('area', formData.area);
    data.append('sellingType', formData.sellingType);
    data.append('description', formData.description);
    data.append('city', formData.city);
    data.append('bedrooms', formData.bedrooms);
    data.append('bathrooms', formData.bathrooms);
    
    // Hamesha append karein kyunki dono ke liye hai
    data.append('paymentMethod', formData.paymentMethod);
    
    // Sirf rent ke waqt duration bhejye
    if (formData.sellingType === 'Rent') {
      data.append('rentDuration', formData.rentDuration);
    }

    if (formData.imageFile) {
      data.append('image', formData.imageFile);
    }

    try {
      const res = await axios.post('http://localhost:5000/api/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 201 || res.status === 200) {
        setMessage('Property added successfully!');
        setFormData({
          title: '', price: '', location: '', ownerEmail: '', area: '',
          sellingType: 'Sell', description: '', city: '', bedrooms: '',
          bathrooms: '', imageFile: null, rentDuration: '', paymentMethod: 'Cash',
        });
        setPreviewImage(null);
      }
    } catch (err) {
      console.error(err);
      setMessage('Error adding property. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', fontFamily: 'Arial' }}>
      <h2>Add New Property</h2>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* --- Purani Input Fields --- */}
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label><br />
          <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Price:</label><br />
          <input type="number" name="price" value={formData.price} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Location:</label><br />
          <input type="text" name="location" value={formData.location} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Owner Email:</label><br />
          <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Area (in Marla):</label><br />
          <input type="number" name="area" value={formData.area} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        {/* --- Selling Type --- */}
        <div style={{ marginBottom: '15px' }}>
          <label>Selling Type:</label><br />
          <select name="sellingType" value={formData.sellingType} onChange={handleChange} style={{ width: '100%', padding: '5px' }}>
            <option value="Sell">Buy/Sell</option>
            <option value="Rent">Rent</option>
          </select>
        </div>

        {/* --- 🟢 Payment Method: Hamesha nazar aayega (Dono ke liye) --- */}
        <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <label><b>Payment Method:</b></label><br />
          <div style={{ display: 'flex', gap: '15px', marginTop: '5px' }}>
            <label>
              <input type="radio" name="paymentMethod" value="Cash" checked={formData.paymentMethod === 'Cash'} onChange={handleChange} /> Cash
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="Bank Transfer" checked={formData.paymentMethod === 'Bank Transfer'} onChange={handleChange} /> Bank
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="Cheque" checked={formData.paymentMethod === 'Cheque'} onChange={handleChange} /> Cheque
            </label>
          </div>
        </div>

        {/* --- 🟡 Rent Duration: Sirf Rent ke liye --- */}
        {formData.sellingType === 'Rent' && (
          <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', border: '1px dotted #ccc' }}>
            <label>Rent Duration (in months):</label><br />
            <input 
              type="number" 
              name="rentDuration" 
              value={formData.rentDuration} 
              onChange={handleChange} 
              required={formData.sellingType === 'Rent'}
              placeholder="e.g. 12"
              style={{ width: '100%' }} 
            />
          </div>
        )}

        {/* --- Baaki Fields --- */}
        <div style={{ marginBottom: '10px' }}>
          <label>Description:</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required style={{ width: '100%' }} />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>City:</label><br />
          <input type="text" name="city" value={formData.city} onChange={handleChange} required style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div>
            <label>Bedrooms:</label>
            <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0" />
          </div>
          <div>
            <label>Bathrooms:</label>
            <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="0" />
          </div>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Property Image:</label><br />
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        </div>

        {previewImage && (
          <div style={{ marginTop: '10px' }}>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '5px' }} />
          </div>
        )}

        <div style={{ marginTop: '20px' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Add Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;