// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = 'https://backendserver-dryq.onrender.com'; // Replace with your backend URL
const socket = io(BACKEND_URL);

const ChatWindow = ({ userId, panditId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const roomId = `${userId}_${panditId}`;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Join chat room on mount
    socket.emit('joinRoom', roomId);

    // Listen for incoming messages
    socket.on('receiveMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
      // Optional: disconnect or leave room if backend supports it
    };
  }, [roomId]);

  useEffect(() => {
    // Scroll to bottom on new messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const messageData = {
      roomId,
      senderId: userId,
      message: input,
      timestamp: Date.now(),
    };

    socket.emit('sendMessage', messageData);
    setMessages((prev) => [...prev, messageData]);
    setInput('');
  };

  return (
    <div style={{
      position: 'fixed', bottom: 0, right: 0, width: 350, height: 400,
      border: '1px solid #ccc', backgroundColor: 'white', display: 'flex',
      flexDirection: 'column', boxShadow: '0 0 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{ padding: 10, borderBottom: '1px solid #ddd', background: '#f5f5f5' }}>
        <strong>Chat with Pandit</strong>
        <button onClick={onClose} style={{ float: 'right' }}>X</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10, fontSize: 14 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: 8,
            textAlign: msg.senderId === userId ? 'right' : 'left'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 12px',
              borderRadius: 20,
              backgroundColor: msg.senderId === userId ? '#DCF8C6' : '#EEE'
            }}>
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: 10, borderTop: '1px solid #ddd' }}>
        <input
          type="text"
          placeholder="Type your message"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          style={{ width: '80%' }}
        />
        <button onClick={sendMessage} style={{ width: '18%', marginLeft: '2%' }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
