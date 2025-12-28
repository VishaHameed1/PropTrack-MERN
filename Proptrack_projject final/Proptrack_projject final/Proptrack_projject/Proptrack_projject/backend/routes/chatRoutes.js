const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// 📌 1. Message Send
// Isme hum isRead: false set kar rahe hain taake receiver ko notification mil sake
router.post('/send', async (req, res) => {
  try {
    const { senderId, senderName, message, senderRole, receiverId } = req.body;
    
    const newMessage = new Message({ 
      senderId, 
      senderName, 
      message, 
      senderRole,
      receiverId: receiverId || "admin",
      isRead: false // Jab tak receiver chat na khole, ye false rahega
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Send Error:", err);
    res.status(500).json({ message: "Message sending failed" });
  }
});

// 📌 2. Admin Chat List with Unread Counts
// Yeh Admin sidebar ke liye hai jo email aur unread count return karega
router.get('/admin/all-chats', async (req, res) => {
  try {
    // Sirf un users ke unique emails nikaalein jinhone messages bheje hain
    const emails = await Message.distinct('senderId', { senderRole: 'seller' });
    
    // Har email ke liye asynchronous check ke kitne messages unread hain
    const chatList = await Promise.all(emails.map(async (email) => {
      const unreadCount = await Message.countDocuments({
        senderId: email,
        senderRole: 'seller', // Sirf seller ke bheje hue messages count karein
        isRead: false
      });
      return { email, unreadCount }; 
    }));

    // Sorting: Taake zyada unread wale upar aa sakein (optional)
    chatList.sort((a, b) => b.unreadCount - a.unreadCount);

    res.json(chatList);
  } catch (err) {
    console.error("Fetch All Chats Error:", err);
    res.status(500).json({ message: "Error fetching admin chats" });
  }
});

// 📌 3. Mark Messages as Read
// Jab admin kisi specific seller ki chat kholta hai, to ye call hoga
router.put('/read/:email', async (req, res) => {
  try {
    const { email } = req.params;
    await Message.updateMany(
      { senderId: email, senderRole: 'seller', isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true, message: `Messages from ${email} marked as read` });
  } catch (err) {
    console.error("Update Read Status Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 4. Specific Chat History
router.get('/:userId', async (req, res) => {
  try {
    const emailIdentifier = req.params.userId;

    const messages = await Message.find({
      $or: [
        { senderId: emailIdentifier },
        { receiverId: emailIdentifier }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Fetch History Error:", err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

module.exports = router;