// backend/middleware/authMiddleware.js

const User = require('../models/User');

// ✅ Admin-only access middleware
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.userId; // will come from token later

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Admin access only' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is blocked' });
    }

    next();
  } catch (error) {
    console.error('❌ Admin Middleware Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { isAdmin };
