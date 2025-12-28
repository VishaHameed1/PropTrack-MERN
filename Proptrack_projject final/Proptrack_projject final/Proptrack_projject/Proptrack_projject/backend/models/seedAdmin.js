// models/seedAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User'); // Same folder mein hai
require('dotenv').config();

const MONGO_URI = "mongodb://localhost:27017/proptrack_db"; // Compass se match karein

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    const hashedPassword = await bcrypt.hash("Admin*12", 10); // Aapka manga hua password
    
    await User.deleteMany({ email: 'admin@proptrack.com' }); // Purana data saaf karein
    
    await User.create({
      name: "Admin",
      email: "admin@proptrack.com",
      password: hashedPassword,
      roles: ["admin"],
      isActive: true
    });
    console.log("🚀 Admin seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
seed();