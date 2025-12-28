import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate, token]);

  // 🗑️ Delete User Function
  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // State update karein taaki user list se gayab ho jaye
        setUsers(users.filter(u => u._id !== id));
        alert("User deleted successfully!");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    }
  };

  const toggleUserStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/status`, 
        { isActive: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(prev =>
        prev.map(user =>
          user._id === id ? { ...user, isActive: newStatus } : user
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user status');
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading users list...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <button 
        onClick={() => navigate('/admin/dashboard')} 
        style={{ marginBottom: '20px', padding: '10px 15px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#34495e', color: 'white', border: 'none' }}
      >
        ⬅️ Back to Dashboard
      </button>

      <h2>👥 User Management Control</h2>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <table border="1" cellPadding="12" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'left' }}>
            <th>Name</th>
            <th>Email</th>
            <th>Account Roles</th>
            <th>Current Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.roles.map(role => (
                    <span key={role} style={{ backgroundColor: '#ecf0f1', padding: '2px 8px', borderRadius: '10px', fontSize: '12px', marginRight: '5px' }}>
                      {role}
                    </span>
                  ))}
                </td>
                <td style={{ fontWeight: 'bold', color: user.isActive ? '#27ae60' : '#c0392b' }}>
                  {user.isActive ? '✅ Active' : '🚫 Blocked'}
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  {/* Block/Unblock Button */}
                  <button
                    style={{ 
                      padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: 'none', color: 'white',
                      backgroundColor: user.isActive ? '#e67e22' : '#2ecc71', transition: '0.3s'
                    }}
                    onClick={() => toggleUserStatus(user._id, !user.isActive)}
                  >
                    {user.isActive ? 'Block' : 'Unblock'}
                  </button>

                  {/* 🗑️ New Delete Button */}
                  <button
                    style={{ 
                      padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: 'none', color: 'white',
                      backgroundColor: '#e74c3c', transition: '0.3s'
                    }}
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No users found in database.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;