import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const BACKEND_URL = 'https://backendserver-dryq.onrender.com';  // Your backend URL

const socket = io(BACKEND_URL, { autoConnect: false });

function ChatWindow({ userId, panditId, onClose, chatName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const roomId = `${userId}_${panditId}`;
  const messagesEndRef = useRef(null);

  // Store sent message IDs to prevent duplicates
  const sentMessageIds = useRef(new Set());

  useEffect(() => {
    socket.connect();
    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', (msg) => {
      // Use a unique message id. Here, timestamp + senderId works (better with UUID)
      const msgId = `${msg.timestamp}_${msg.senderId}`;
      if (sentMessageIds.current.has(msgId)) {
        // Ignore duplicate
        return;
      }
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
      sentMessageIds.current.clear();
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

    // Track sent message id to ignore duplicates later
    const msgId = `${msgObj.timestamp}_${msgObj.senderId}`;
    sentMessageIds.current.add(msgId);

    setMessages(prev => [...prev, msgObj]);
    socket.emit('sendMessage', msgObj);
    setInput('');
  };

  return (
    <div style={{
      position: 'fixed', bottom: 0, right: 0, width: 350, height: 400,
      border: '1px solid #ccc', backgroundColor: 'white', display: 'flex',
      flexDirection: 'column', boxShadow: '0 0 10px rgba(0,0,0,0.3)',
      zIndex: 9999
    }}>
      <div style={{ padding: 10, borderBottom: '1px solid #ddd', backgroundColor: '#f5f5f5' }}>
        <strong>Chat with {chatName}</strong>
        <button
          onClick={onClose}
          style={{ float: 'right', border: 'none', background: 'transparent', cursor: 'pointer' }}
          aria-label="Close chat"
        >
          ✖
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 10, fontSize: 14 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8, textAlign: msg.senderId === userId ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: msg.senderId === userId ? '#DCF8C6' : '#EEE',
              padding: '6px 12px',
              borderRadius: 20,
              maxWidth: '80%',
              wordWrap: 'break-word',
            }}>
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: 10, borderTop: '1px solid #ddd', display: 'flex' }}>
        <input
          type="text"
          placeholder="Type a message"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          style={{ flex: 1, marginRight: 5, padding: 8 }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
