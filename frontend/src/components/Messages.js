import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { messagesAPI } from '../services/api';
import './Messages.css';

const Messages = () => {
  const { user, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Load conversations and messages
  useEffect(() => {
    const loadMessagesData = async () => {
      try {
        setLoading(true);
        
        // Load conversations
        const conversationsResponse = await messagesAPI.getConversations();
        if (conversationsResponse.success) {
          setConversations(conversationsResponse.conversations);
        }
        
        // Load unread count
        const unreadResponse = await messagesAPI.getUnreadCount();
        if (unreadResponse.success) {
          setUnreadCount(unreadResponse.unreadCount);
        }
        
      } catch (error) {
        console.error('Error loading messages data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessagesData();
  }, []);

  // Load messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      loadConversationMessages(selectedConversation.partnerId);
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversationMessages = async (partnerId) => {
    try {
      const response = await messagesAPI.getConversation(partnerId);
      if (response.success) {
        setMessages(response.messages);
      }
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const response = await messagesAPI.sendMessage({
        toUserId: selectedConversation.partnerId,
        content: newMessage.trim(),
        type: 'text'
      });

      if (response.success) {
        setNewMessage('');
        // Reload messages
        loadConversationMessages(selectedConversation.partnerId);
        // Reload conversations to update last message
        const conversationsResponse = await messagesAPI.getConversations();
        if (conversationsResponse.success) {
          setConversations(conversationsResponse.conversations);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="messages-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      {/* Navigation */}
      <nav className="messages-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <Link to="/dashboard" className="brand-link">SkillSwap</Link>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/matches" className="nav-link">Matches</Link>
            <Link to="/sessions" className="nav-link">Sessions</Link>
            <Link to="/messages" className="nav-link active">Messages</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="messages-main">
        <div className="messages-content">
          {/* Header */}
          <div className="messages-header">
            <h1 className="messages-title">Messages</h1>
            <p className="messages-subtitle">Connect with your skill exchange partners</p>
            {unreadCount > 0 && (
              <div className="unread-badge">
                {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="messages-layout">
            {/* Conversations Sidebar */}
            <div className="conversations-sidebar">
              <div className="conversations-header">
                <h3>Conversations</h3>
                <span className="conversation-count">{conversations.length}</span>
              </div>
              
              <div className="conversations-list">
                {conversations.length === 0 ? (
                  <div className="no-conversations">
                    <div className="no-conversations-icon">💬</div>
                    <p>No conversations yet</p>
                    <p className="no-conversations-subtitle">
                      Start a conversation with someone from your matches!
                    </p>
                  </div>
                ) : (
                  conversations.map(conversation => (
                    <div
                      key={conversation.partnerId}
                      className={`conversation-item ${selectedConversation?.partnerId === conversation.partnerId ? 'active' : ''}`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="conversation-avatar">
                        {conversation.partnerId.charAt(0).toUpperCase()}
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-header">
                          <h4 className="conversation-name">
                            User {conversation.partnerId.slice(-4)}
                          </h4>
                          <span className="conversation-time">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                        </div>
                        <p className="conversation-preview">
                          {conversation.lastMessage.content}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <div className="conversation-unread">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="chat-area">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="chat-header">
                    <div className="chat-partner-info">
                      <div className="chat-avatar">
                        {selectedConversation.partnerId.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3>User {selectedConversation.partnerId.slice(-4)}</h3>
                        <p className="chat-status">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="messages-list">
                    {messages.length === 0 ? (
                      <div className="no-messages">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map(message => (
                        <div
                          key={message._id}
                          className={`message ${message.from === user?.id ? 'sent' : 'received'}`}
                        >
                          <div className="message-content">
                            <p>{message.content}</p>
                            <span className="message-time">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="message-input-form">
                    <div className="message-input-container">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="message-input"
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="send-button"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="no-conversation-selected">
                  <div className="no-conversation-icon">💬</div>
                  <h3>Select a conversation</h3>
                  <p>Choose a conversation from the sidebar to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
