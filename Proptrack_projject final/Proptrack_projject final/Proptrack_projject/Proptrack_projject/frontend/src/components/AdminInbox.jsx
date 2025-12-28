import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminInbox = () => {
  const [chats, setChats] = useState([]); // Ab isme [{email, unreadCount}] objects aayenge
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const messagesEndRef = useRef(null); 
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Fetch all chats with unread counts
  const fetchChats = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chat/admin/all-chats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data);
    } catch (err) {
      console.error("Error fetching chats", err);
    }
  }, [token]);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [fetchChats]);

  // 2. Mark messages as read
  const markAsRead = async (email) => {
    try {
      await axios.put(`http://localhost:5000/api/chat/read/${email}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchChats(); // UI mein badge foran hatane ke liye
    } catch (err) {
      console.error("Error marking as read", err);
    }
  };

  // 3. Fetch messages for selected user
  const fetchMessages = useCallback(async () => {
    if (!selectedEmail) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/chat/${selectedEmail}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  }, [selectedEmail]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendReply = async (e) => {
    if (e) e.preventDefault();
    if (!reply.trim() || !selectedEmail) return;

    try {
      const res = await axios.post('http://localhost:5000/api/chat/send', {
        senderId: "admin",
        receiverId: selectedEmail,
        senderName: "Admin Support",
        message: reply.trim(),
        senderRole: 'admin'
      });
      
      setMessages(prev => [...prev, res.data]);
      setReply('');
    } catch (err) {
      console.error("Reply failed", err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <button 
        onClick={() => navigate('/admin/dashboard')} 
        style={{ marginBottom: '20px', padding: '10px 20px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#34495e', color: 'white', border: 'none', fontWeight: 'bold' }}
      >
        ⬅️ Back to Dashboard
      </button>

      <div style={{ display: 'flex', height: '80vh', border: '1px solid #ddd', borderRadius: '12px', overflow: 'hidden', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        
        {/* Sidebar */}
        <div style={{ width: '30%', borderRight: '1px solid #eee', overflowY: 'auto', backgroundColor: '#fff' }}>
          <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
            <h4 style={{ margin: 0, color: '#2c3e50' }}>Recent Chats</h4>
          </div>
          {chats.map((chat, index) => (
            <div 
              key={index} 
              onClick={() => {
                setSelectedEmail(chat.email);
                markAsRead(chat.email); // Click karne par badge khatam hoga
              }}
              style={{ 
                padding: '15px 20px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0', 
                backgroundColor: selectedEmail === chat.email ? '#e8f5e9' : 'transparent',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.2s'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: selectedEmail === chat.email ? 'bold' : 'normal', color: '#333' }}>{chat.email}</div>
                <small style={{ color: chat.unreadCount > 0 ? '#2e7d32' : '#888', fontWeight: chat.unreadCount > 0 ? 'bold' : 'normal' }}>
                  {chat.unreadCount > 0 ? 'New message available' : 'Click to view messages'}
                </small>
              </div>

              {/* 🔴 Unread Badge */}
              {chat.unreadCount > 0 && selectedEmail !== chat.email && (
                <div style={{ 
                  backgroundColor: '#e74c3c', color: 'white', minWidth: '22px', height: '22px', 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: 'bold', marginLeft: '10px'
                }}>
                  {chat.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div style={{ width: '70%', display: 'flex', flexDirection: 'column', backgroundColor: '#fcfcfc' }}>
          {selectedEmail ? (
            <>
              <div style={{ padding: '15px 25px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>👤 {selectedEmail}</span>
                <span style={{ fontSize: '12px', opacity: 0.8 }}>Online Support</span>
              </div>
              
              <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((msg, i) => (
                  <div key={i} style={{
                    alignSelf: msg.senderRole === 'admin' ? 'flex-end' : 'flex-start',
                    backgroundColor: msg.senderRole === 'admin' ? '#dcf8c6' : '#fff',
                    color: '#333',
                    padding: '10px 15px', borderRadius: '12px', 
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)', maxWidth: '75%',
                  }}>
                    <div style={{ fontSize: '14px' }}>{msg.message}</div>
                    <div style={{ fontSize: '10px', marginTop: '4px', color: '#999', textAlign: 'right' }}>
                       {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Section */}
              <div style={{ padding: '15px 20px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
                <form onSubmit={sendReply} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="text" 
                    value={reply} 
                    onChange={(e) => setReply(e.target.value)} 
                    placeholder="Type your reply..." 
                    style={{ 
                      flex: 1, padding: '12px 18px', borderRadius: '25px', 
                      border: '1px solid #ddd', outline: 'none', fontSize: '14px', backgroundColor: '#f9f9f9'
                    }} 
                  />
                  <button 
                    type="submit" 
                    style={{ 
                      backgroundColor: '#2e7d32', color: 'white', border: 'none', 
                      borderRadius: '50%', width: '45px', height: '45px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      cursor: 'pointer', flexShrink: 0 
                    }}
                  >
                    <span style={{ transform: 'rotate(-45deg)', display: 'inline-block', fontSize: '20px', marginLeft: '3px' }}>➤</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bdc3c7', flexDirection: 'column' }}>
              <div style={{ fontSize: '50px', marginBottom: '10px' }}>💬</div>
              <h3>Select a chat to respond</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;