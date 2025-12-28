import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const SellerChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  // 1. User data extraction - Focus on Email
  const getUser = useCallback(() => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;
      
      const parsedUser = JSON.parse(userData);
      const finalUser = parsedUser.user || parsedUser;

      // Debugging check
      console.log("Chat User Email:", finalUser.email);
      
      return finalUser;
    } catch (error) {
      console.error("Localstorage error:", error);
      return null;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 2. Fetch Messages using Email as Identifier
  const fetchMessages = useCallback(async () => {
    const user = getUser();
    const userEmail = user?.email; // ID ki jagah Email use kar rahe hain

    if (!userEmail) {
      console.warn("Fetch skipped: No email found in user object.");
      return;
    }

    try {
      // Backend route ko email bhej rahe hain
      const res = await axios.get(`http://localhost:5000/api/chat/${userEmail}`);
      if (res.data) setChatHistory(res.data);
    } catch (err) {
      console.error('Fetch error (Check if backend handles email as ID):', err.message);
    }
  }, [getUser]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, scrollToBottom]);

  // 3. Send Message Logic using Email
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    
    const user = getUser();
    const userEmail = user?.email;

    if (!message.trim()) return;

    if (!userEmail) {
      alert("Error: User email not found. Please login again.");
      return;
    }

    const msgData = {
      senderId: userEmail, // Ab senderId mein email jayega
      senderName: user.name || 'Seller',
      message: message.trim(),
      senderRole: 'seller',
      timestamp: new Date()
    };

    try {
      setMessage(''); 
      await axios.post('http://localhost:5000/api/chat/send', msgData);
      fetchMessages(); 
    } catch (err) {
      console.error('Send error:', err);
      alert('Failed to send. Make sure backend accepts email as senderId.');
    }
  };

  const handleKeyUp = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  const user = getUser();
  if (!user) return null;

  return (
    <>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '20px', right: '20px',
          width: '55px', height: '55px', backgroundColor: '#2e7d32',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 10001, fontSize: '24px', color: 'white'
        }}
      >
        {isOpen ? '✕' : '💬'}
      </div>

      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '85px', right: '20px',
          width: '320px', height: '420px',
          backgroundColor: 'white', borderRadius: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column',
          zIndex: 10001, border: '1px solid #ccc', overflow: 'hidden'
        }}>
          
          <div style={{ padding: '12px 15px', borderBottom: '1px solid #eee', backgroundColor: '#fff' }}>
            <h3 style={{ margin: 0, fontSize: '16px', color: '#2e7d32' }}>Chat Support</h3>
            <small style={{ color: '#888' }}>Logged in: {user.email}</small>
          </div>
          
          <div style={{ 
            flex: 1, overflowY: 'auto', padding: '15px', 
            backgroundColor: '#f5f5f5', display: 'flex', flexDirection: 'column', gap: '8px' 
          }}>
            {chatHistory.length > 0 ? (
              chatHistory.map((item, index) => (
                <div key={index} style={{
                  alignSelf: item.senderRole === 'seller' ? 'flex-end' : 'flex-start',
                  backgroundColor: item.senderRole === 'seller' ? '#dcf8c6' : '#fff',
                  padding: '8px 12px', borderRadius: '12px', maxWidth: '85%',
                  fontSize: '13px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)', wordBreak: 'break-word'
                }}>
                  <b style={{ display: 'block', fontSize: '10px', color: '#666', marginBottom: '2px' }}>
                    {item.senderRole === 'seller' ? 'You' : 'Admin'}
                  </b>
                  {item.message}
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#999', marginTop: '40%', fontSize: '14px' }}>
                No messages yet.
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: '12px', backgroundColor: 'white', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                style={{
                  flex: 1, padding: '10px 15px', borderRadius: '25px',
                  border: '1px solid #ddd', outline: 'none', fontSize: '14px'
                }}
                type="text" 
                placeholder="Type your message..." 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyUp={handleKeyUp} 
              />
              <button 
                onClick={handleSendMessage}
                style={{
                  backgroundColor: '#2e7d32', color: 'white', border: 'none',
                  borderRadius: '50%', width: '38px', height: '38px', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerChat;