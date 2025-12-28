const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ---------------------------
// 📌 Register Route
// ---------------------------
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let rolesArray = [role];
    // Security: Admin sirf specific email se hi ban sakega
    if (email === "admin@proptrack.com") {
      rolesArray = ["admin"];
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      roles: rolesArray,
      isActive: true // By default user active rahega
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ---------------------------
// 📌 Login Route
// ---------------------------
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // ✅ 1. BLOCKED USER CHECK (Sabse Pehle)
    // Agar admin ne user ko block kiya hai, toh aage password check karne ki zarurat hi nahi
    if (user.isActive === false) {
      return res.status(403).json({
        message: 'Your account has been blocked by admin. Please contact support.'
      });
    }

    // ✅ 2. ADMIN PORTAL CHECK
    // Admin ko frontend (Buyer/Seller login) se rokne ke liye
    if (user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Admin must login from the Admin Portal' });
    }

    // ✅ 3. ROLE VERIFICATION
    if (!user.roles.includes(role)) {
      return res.status(403).json({ message: `Access denied for role: ${role}` });
    }

    // ✅ 4. PASSWORD VERIFICATION
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ 5. TOKEN GENERATION
    // process.env.JWT_SECRET use karein taaki admin aur user tokens sync rahein
    const token = jwt.sign(
      { userId: user._id, roles: user.roles },
      process.env.JWT_SECRET || "proptrack_secret_key", 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
        roles: user.roles
      }
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;