// models/Chat.js
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  senderId: { type: String, required: true }, // Isay 'String' hona chahiye, 'ObjectId' nahi
  senderName: String,
  message: { type: String, required: true },
  senderRole: { type: String, enum: ['seller', 'admin'], default: 'seller' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', chatSchema);