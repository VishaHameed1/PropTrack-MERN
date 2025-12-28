// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import BuyProperty from './components/BuyProperty';
import SellProperty from './components/SellProperty';
import RentProperty from './components/RentProperty';
import PropertyDetails from './components/PropertyDetails'; // path sahi lagao
import AddProperty from './components/AddProperty';
import EditProperty from './components/EditProperty'; // ✅ Renamed to avoid conflict
import MyBookings from './components/MyBookings'; // ✅ import component
import SellerRequests from './components/SellerRequests';
import BookingRequests from './components/BookingRequests';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import AdminProperties from './components/AdminProperties';
import AdminInbox from './components/AdminInbox';

// import Buy from './pages/Buy';    // Future use
// import Sell from './pages/Sell';  // Future use
// import Rent from './pages/Rent';  // Future use

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Future Routes */}
        {/* <Route path="/buy" element={<Buy />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/rent" element={<Rent />} /> */}
        <Route path="/property/:id" element={<PropertyDetails />} />

        <Route path="/property/detail" element={<PropertyDetails />} />

        <Route path="/buy" element={<BuyProperty />} />
        <Route path="/sell" element={<SellProperty />} />
        <Route path="/rent" element={<RentProperty />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/edit-property" element={<EditProperty />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/seller/requests" element={<SellerRequests />} />
        <Route path="/booking-requests" element={<BookingRequests />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/properties" element={<AdminProperties />} />
        <Route path="/admin/inbox" element={<AdminInbox />} />







      </Routes>
      
    </Router>
  );
}

export default App;
