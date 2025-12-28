import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [unreadTotal, setUnreadTotal] = useState(0); // Unread messages count state

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Unread messages count fetch karne ka logic
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/admin/unread-count', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadTotal(res.data.totalUnread);
      } catch (err) {
        console.error("Error fetching unread count", err);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000); // Har 10 sec baad check karein
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Sidebar Navigation */}
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>PropTrack Admin</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '30px' }}>
          
          <li onClick={() => navigate('/admin/users')} style={navItemStyle}>
            👥 Manage Users
          </li>

          <li onClick={() => navigate('/admin/properties')} style={navItemStyle}>
            🏘️ Manage Properties
          </li>

          {/* Sidebar Chat Link with Badge */}
          <li onClick={() => navigate('/admin/inbox')} style={{ ...navItemStyle, display: 'flex', justifyContent: 'space-between' }}>
            <span>📩 Seller Messages</span>
            {unreadTotal > 0 && (
              <span style={badgeStyleSidebar}>{unreadTotal}</span>
            )}
          </li>

          <li 
            onClick={handleLogout} 
            style={{ ...navItemStyle, color: '#e74c3c', marginTop: '30px', borderBottom: 'none' }}
          >
            🚪 Logout
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '30px', backgroundColor: '#f4f7f6' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Admin Dashboard</h1>
          <span>Logged in as: <strong>Super Admin</strong></span>
        </header>
        
        <hr style={{ marginBottom: '30px' }} />

        {/* Quick Access Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div style={cardStyle} onClick={() => navigate('/admin/users')}>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>👥</h2>
            <h3>Manage Users</h3>
            <p>User accounts ko block, unblock ya delete karein</p>
          </div>

          <div style={cardStyle} onClick={() => navigate('/admin/properties')}>
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>🏘️</h2>
            <h3>Manage Properties</h3>
            <p>Sabhi users ki listed properties dekhein</p>
          </div>

          {/* 📩 Inbox Card with Notification Badge */}
          <div style={{ ...cardStyle, borderTop: '5px solid #2ecc71', position: 'relative' }} onClick={() => navigate('/admin/inbox')}>
            {unreadTotal > 0 && (
              <div style={badgeStyleCard}>{unreadTotal} New</div>
            )}
            <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>📩</h2>
            <h3>Seller Inbox</h3>
            <p>Sellers ke sawalon ke jawab dein</p>
          </div>

        </div>
      </div>
    </div>
  );
};

// Styles
const navItemStyle = {
  padding: '15px 10px',
  cursor: 'pointer',
  borderBottom: '1px solid #34495e',
  fontSize: '1.1rem',
  transition: 'background 0.3s'
};

const cardStyle = {
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'transform 0.2s ease-in-out',
};

const badgeStyleSidebar = {
  backgroundColor: '#e74c3c',
  color: 'white',
  borderRadius: '50%',
  padding: '2px 8px',
  fontSize: '0.8rem',
  fontWeight: 'bold'
};

const badgeStyleCard = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: '#e74c3c',
  color: 'white',
  padding: '5px 12px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
};

export default AdminDashboard;