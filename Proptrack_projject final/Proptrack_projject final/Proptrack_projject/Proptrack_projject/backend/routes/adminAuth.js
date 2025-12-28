const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

const JWT_SECRET = "proptrack_secret_key";

// Admin login (hidden, backend only)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Only allow admin email
    if (email !== 'admin@proptrack.com') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Admin login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });

  } catch (error) {
    console.error("❌ Admin Login Error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
