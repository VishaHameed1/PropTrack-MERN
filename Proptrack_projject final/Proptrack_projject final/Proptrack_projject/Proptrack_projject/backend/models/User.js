const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'], // Error message add kiya
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // 🛡️ Yeh duplicate registration ko database level par rokega
    lowercase: true, // 📧 Taaki 'Ali@gmail.com' aur 'ali@gmail.com' ek hi mane jayein
    trim: true, // Extra spaces ko remove karega
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] // Email format check
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  roles: {
    type: [String],
    enum: ['buyer', 'seller', 'admin'],
    default: ['buyer']
  },
  isActive: {
    type: Boolean,
    default: true // Admin isko false karke user ko block kar sakta hai
  }
}, { timestamps: true }); // Taaki pata chale user kab register hua

module.exports = mongoose.model('User', userSchema);