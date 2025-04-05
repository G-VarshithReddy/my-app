import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Messages.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/contact/messages");
      setMessages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to fetch messages");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        setError('Admin authentication required');
        return;
      }

      await axios.delete(`http://localhost:5000/contact/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      setMessages(messages.filter(message => message.id !== id));
      setError('');
    } catch (error) {
      console.error('Error deleting message:', error);
      setError(error.response?.data?.message || 'Failed to delete message');
    }
  };

  if (loading) {
    return (
      <div className="messages-container">
        <div className="loading">Loading messages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="messages-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <h1 className="messages-title">Contact Messages</h1>
      <div className="messages-grid">
        {messages.map((message) => (
          <div key={message.id} className="message-card">
            <div className="message-header">
              <span className="message-id">#{message.id}</span>
              <span className="message-email">{message.email}</span>
            </div>
            <div className="message-content">
              <p>{message.message}</p>
              {message.password && (
                <p className="password-field">
                  <span className="password-label">Password:</span>
                  <span className="password-value">{message.password}</span>
                </p>
              )}
            </div>
            <div className="message-actions">
              <button 
                className="delete-btn"
                onClick={() => handleDelete(message.id)}
              >
                RESPONDED
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages; 