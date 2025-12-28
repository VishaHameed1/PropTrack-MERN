const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chatRoutes = require('./routes/chatRoutes');
// Routes Import
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const adminRoutes = require('./routes/adminRoutes');
const app = express();

// --- 1. MIDDLEWARES (Inka order bohat zaruri hai) ---
app.use(cors());
app.use(express.json()); // Ye line data read karne ke liye sab se upar honi chahiye
app.use('/uploads', express.static('uploads')); 

// --- 2. ROUTES ---
// Admin login aur routes
app.use('/admin', adminAuthRoutes);
app.use('/admin', adminRoutes);
app.use('/api/admin', adminRoutes);
// User aur Property routes
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
// --- 3. DATABASE CONNECTION ---
mongoose.connect('mongodb://localhost:27017/proptrack_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// --- 4. SERVER START ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});