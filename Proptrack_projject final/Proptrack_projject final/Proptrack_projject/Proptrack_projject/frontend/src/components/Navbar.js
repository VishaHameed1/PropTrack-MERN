import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // LocalStorage se user data aur token lein
  const user = JSON.parse(localStorage.getItem('user'));
  const adminToken = localStorage.getItem('adminToken'); 
  const roles = user?.roles || []; 

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken'); 
    navigate('/login');
  };

  return (
    <>
      <div className="top-bar"></div>
      <nav className="navbar">
        <div className="logo">
          <NavLink to="/" className="brand">
            Prop<span style={{ color: '#2e7d32' }}>Track</span>
          </NavLink>
        </div>
        <ul className="nav-links">
          {/* Admin Dashboard link */}
          {roles.includes('admin') ? (
            <li>
              <NavLink to="/admin/dashboard" className="nav-item dashboard-btn">
                📊 Admin Dashboard
              </NavLink>
            </li>
          ) : (
            <li><NavLink to="/" end className="nav-item">Home</NavLink></li>
          )}

          {/* Buyer Links */}
          {roles.includes('buyer') && (
            <>
              <li><NavLink to="/buy" className="nav-item">Buy</NavLink></li>
              <li><NavLink to="/rent" className="nav-item">Rent</NavLink></li>
              <li><NavLink to="/my-bookings" className="nav-item">My Bookings</NavLink></li>
            </>
          )}

          {/* Seller Links */}
          {roles.includes('seller') && (
            <>
              <li><NavLink to="/sell" className="nav-item">My Properties</NavLink></li>
              <li><NavLink to="/booking-requests" className="nav-item">Booking Requests</NavLink></li>
            </>
          )}

          {/* Auth Links */}
          {!user && !adminToken ? (
            <>
              <li><NavLink to="/login" className="nav-item">Login</NavLink></li>
              <li><NavLink to="/register" className="nav-item">Register</NavLink></li>
            </>
          ) : (
            <li className="user-section" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* 📧 Yahan User ka Email show hoga */}
              <span className="user-email" style={{ color: '#2e7d32', fontWeight: '600', fontSize: '0.9rem' }}>
                👤 {user?.email || 'Admin'}
              </span>
              <button onClick={handleLogout} className="nav-item logout-btn" style={{ padding: '5px 10px' }}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;