const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const verifyToken = require('../middleware/verifyToken.js');
const { isAdmin } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 🔹 ADMIN LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.roles.includes('admin')) {
      return res.status(401).json({ message: 'Invalid credentials or not an admin' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.roles },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({ message: 'Login successful', token, user: { name: user.name, email: user.email, roles: user.roles } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 DASHBOARD STATS
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ roles: { $ne: 'admin' } });
    const totalProperties = await Property.countDocuments();
    res.json({ totalUsers, totalProperties });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// 🔹 MANAGE USERS

// Get all users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({ roles: { $ne: 'admin' } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🗑️ DELETE USER (Ye missing tha jiski wajah se error aa raha tha)
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Server error while deleting user" });
  }
});

// Block/Unblock User
router.put('/users/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `User ${isActive ? 'unblocked' : 'blocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔹 MANAGE PROPERTIES

router.get('/properties', verifyToken, isAdmin, async (req, res) => {
  try {
    const properties = await Property.find({});
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

router.delete('/properties/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.patch('/properties/:id/status', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: "Property status updated", property });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;