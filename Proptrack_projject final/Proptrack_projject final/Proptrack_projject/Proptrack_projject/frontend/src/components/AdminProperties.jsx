import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 1. useNavigate import kiya

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. navigate initialize kiya

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/properties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching properties:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProperties(properties.filter(p => p._id !== id));
        alert("Property deleted successfully!");
      } catch (err) {
        alert("Error deleting property");
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/admin/properties/${id}/status`, 
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } });
      
      setProperties(properties.map(p => p._id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert("Error updating status");
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading properties...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      {/* 3. Ab yeh button sahi kaam karega */}
      <button 
        onClick={() => navigate('/admin/dashboard')} 
        style={{ 
          marginBottom: '20px', 
          padding: '10px 15px', 
          cursor: 'pointer',
          backgroundColor: '#34495e',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        ⬅️ Back to Dashboard
      </button>

      <h1>🏘️ Property Management Control</h1>
      
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
            <th>Title</th>
            <th>Price</th>
            <th>Location</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.length > 0 ? (
            properties.map((prop) => (
              <tr key={prop._id}>
                <td>{prop.title || prop.description}</td> 
                <td>PKR {prop.price}</td>
                <td>{prop.location}, {prop.city}</td>
                <td>
                  <select 
                    value={prop.status} 
                    onChange={(e) => handleStatusChange(prop._id, e.target.value)}
                    style={{
                      padding: '5px',
                      fontWeight: 'bold',
                      color: prop.status === 'booked' ? 'red' : 'green'
                    }}
                  >
                    <option value="vacant">Vacant</option>
                    <option value="booked">Booked</option>
                  </select>
                </td>
                <td>{prop.ownerEmail}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(prop._id)}
                    style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No properties found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProperties;