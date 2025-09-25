const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
    req.user = user;
    next();
  });
};

// Get all conversations for current user
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('messages');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get all unique conversation partners
    const conversations = new Map();
    
    if (user.messages) {
      user.messages.forEach(message => {
        const partnerId = message.from.toString() === req.user.userId 
          ? message.to.toString() 
          : message.from.toString();
        
        if (!conversations.has(partnerId)) {
          conversations.set(partnerId, {
            partnerId,
            lastMessage: message,
            unreadCount: 0,
            messages: []
          });
        }
        
        const conversation = conversations.get(partnerId);
        conversation.messages.push(message);
        
        // Update last message if this is more recent
        if (new Date(message.timestamp) > new Date(conversation.lastMessage.timestamp)) {
          conversation.lastMessage = message;
        }
        
        // Count unread messages
        if (message.from.toString() !== req.user.userId && !message.read) {
          conversation.unreadCount++;
        }
      });
    }

    // Convert to array and sort by last message timestamp
    const conversationsList = Array.from(conversations.values())
      .sort((a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp));

    res.json({
      success: true,
      conversations: conversationsList
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get messages with a specific user
router.get('/conversation/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, page = 1 } = req.query;
    
    const user = await User.findById(req.user.userId).select('messages');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get messages with this user
    const messages = user.messages.filter(message => 
      (message.from.toString() === userId && message.to.toString() === req.user.userId) ||
      (message.from.toString() === req.user.userId && message.to.toString() === userId)
    );

    // Sort by timestamp (oldest first)
    messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedMessages = messages.slice(startIndex, endIndex);

    // Mark messages as read
    const unreadMessages = messages.filter(message => 
      message.from.toString() === userId && 
      message.to.toString() === req.user.userId && 
      !message.read
    );

    if (unreadMessages.length > 0) {
      unreadMessages.forEach(message => {
        message.read = true;
        message.readAt = new Date();
      });
      await user.save();
    }

    res.json({
      success: true,
      messages: paginatedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: messages.length,
        pages: Math.ceil(messages.length / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Send a message
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { toUserId, content, type = 'text' } = req.body;
    
    // Validation
    if (!toUserId || !content) {
      return res.status(400).json({
        success: false,
        message: 'toUserId and content are required'
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    // Check if user is trying to message themselves
    if (toUserId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send message to yourself'
      });
    }

    const message = {
      from: req.user.userId,
      to: toUserId,
      content,
      type,
      timestamp: new Date(),
      read: false
    };

    // Add message to sender's record
    const sender = await User.findById(req.user.userId);
    if (!sender.messages) {
      sender.messages = [];
    }
    sender.messages.push(message);
    await sender.save();

    // Add message to receiver's record
    if (!targetUser.messages) {
      targetUser.messages = [];
    }
    targetUser.messages.push(message);
    await targetUser.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageData: message
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Mark message as read
router.put('/read/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const message = user.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only mark as read if user is the recipient
    if (message.to.toString() === req.user.userId) {
      message.read = true;
      message.readAt = new Date();
      await user.save();
    }

    res.json({
      success: true,
      message: 'Message marked as read'
    });

  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get unread message count
router.get('/unread/count', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('messages');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const unreadCount = user.messages ? user.messages.filter(message => 
      message.to.toString() === req.user.userId && !message.read
    ).length : 0;

    res.json({
      success: true,
      unreadCount
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete a message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const message = user.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only allow deletion if user is the sender
    if (message.from.toString() === req.user.userId) {
      user.messages.pull(messageId);
      await user.save();
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search messages
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query, limit = 20, page = 1 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const user = await User.findById(req.user.userId).select('messages');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Search in message content
    const searchResults = user.messages.filter(message => 
      message.content.toLowerCase().includes(query.toLowerCase())
    );

    // Sort by timestamp (newest first)
    searchResults.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    res.json({
      success: true,
      messages: paginatedResults,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: searchResults.length,
        pages: Math.ceil(searchResults.length / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
