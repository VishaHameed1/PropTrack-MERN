const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property', // 'Property' model se link hai
    required: true
  },
  buyerEmail: {
    type: String,
    required: true
  },
  sellerEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    // Humne 'booked' aur 'rejected' add kiya hai taake routes se match kare
    enum: ['pending', 'booked', 'rejected', 'confirmed', 'denied'], 
    default: 'pending'
  }
}, { 
  timestamps: true // Isse createdAt aur updatedAt automatically handle honge
});

module.exports = mongoose.model('Booking', bookingSchema);