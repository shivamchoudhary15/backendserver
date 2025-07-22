// ChatWindow.js
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Replace with your backend URL (matching CORS origin on backend)
const BACKEND_URL = 'http://localhost:5000';

const socket = io(BACKEND_URL, { autoConnect: false });

const ChatWindow = ({ userId, panditId, onClose, chatName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const roomId = `${userId}_${panditId}`;
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.connect();
    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msgObj = {
      roomId,
      senderId: userId,
      message: input,
      timestamp: Date.now(),
    };

    socket.emit('sendMessage', msgObj);
    setMessages(prev => [...prev, msgObj]);
    setInput('');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: 350,
      height: 400,
      border: '1px solid gray',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      boxShadow: '0 0 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{ padding: 10, borderBottom: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
        <b>Chat with {chatName}</b>
        <button onClick={onClose} style={{ float: 'right' }}>X</button>
      </div>
      <div style={{ flex: 1, padding: 10, overflowY: 'auto'}}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.senderId === userId ? 'right' : 'left', marginBottom: 8 }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: msg.senderId === userId ? '#DCF8C6' : '#EEE',
              padding: '8px 12px',
              borderRadius: 15,
              maxWidth: '80%',
              wordWrap: 'break-word'
            }}>
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding: 10, borderTop: '1px solid #ccc', display: 'flex' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message"
          style={{ flex: 1, marginRight: 5, padding: 8 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
