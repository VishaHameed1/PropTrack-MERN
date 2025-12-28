const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: String, 
    required: true 
  }, // Seller ki Email ya 'admin' string
  senderName: { 
    type: String 
  },
  message: { 
    type: String, 
    required: true 
  },
  senderRole: { 
    type: String, 
    enum: ['seller', 'admin'], 
    default: 'seller' 
  },
  receiverId: { 
    type: String, 
    required: true, // Required kiya taake pata chale message ja kisko raha hai
    default: 'admin' 
  },
  isRead: { 
    type: Boolean, 
    default: false // Naya message hamesha unread (false) hoga
  }
}, { timestamps: true });

// Indexing (Optional but Recommended): 
// Isse chat history fetch karne ki speed barh jati hai
messageSchema.index({ senderId: 1, receiverId: 1 });

module.exports = mongoose.model('Message', messageSchema);