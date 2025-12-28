const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  ownerEmail: { type: String, required: true },
  area: { type: Number, required: true }, // in Marla
  sellingType: { 
    type: String, 
    enum: ['Sell', 'Rent'], // 'Sell' matlab Buy option
    required: true 
  },
  description: { type: String, required: true },
  city: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  image: { type: String, required: true }, // filename string
  
  // 🟢 Naye Fields jo humne Frontend mein add kiye hain
  paymentMethod: { 
    type: String, 
    enum: ['Cash', 'Bank Transfer', 'Cheque'], 
    default: 'Cash' 
  },
  rentDuration: { 
    type: Number, 
    // Yeh sirf tab required hoga jab sellingType 'Rent' ho
    required: function() { return this.sellingType === 'Rent'; } 
  },

  // 🔵 Status aur Deletion Logic
  status: {
    type: String,
    enum: ['booked', 'pending', 'vacant'],
    default: 'vacant'
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    type: String,
    enum: ['seller', 'admin', null],
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true }); // Isse createdAt aur updatedAt khud bakhud ban jayenge

module.exports = mongoose.model('Property', propertySchema);