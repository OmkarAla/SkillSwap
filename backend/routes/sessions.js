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

// Get all sessions for current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    
    const user = await User.findById(req.user.userId).populate('sessions.with', 'name email');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let sessions = user.sessions;
    
    // Filter by status if provided
    if (status) {
      sessions = sessions.filter(session => session.status === status);
    }

    // Sort by date (newest first)
    sessions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Pagination
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedSessions = sessions.slice(startIndex, endIndex);

    res.json({
      success: true,
      sessions: paginatedSessions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: sessions.length,
        pages: Math.ceil(sessions.length / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create a new session
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { withUserId, date, skill, notes } = req.body;
    
    // Validation
    if (!withUserId || !date || !skill) {
      return res.status(400).json({
        success: false,
        message: 'withUserId, date, and skill are required'
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(withUserId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found'
      });
    }

    // Check if user is trying to create session with themselves
    if (withUserId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create session with yourself'
      });
    }

    // Create session for current user
    const currentUser = await User.findById(req.user.userId);
    const newSession = {
      with: withUserId,
      date,
      skill,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date()
    };

    currentUser.sessions.push(newSession);
    await currentUser.save();

    // Create corresponding session for target user
    const targetUserSession = {
      with: req.user.userId,
      date,
      skill,
      status: 'pending',
      notes: notes || '',
      createdAt: new Date()
    };

    targetUser.sessions.push(targetUserSession);
    await targetUser.save();

    // Populate the session data
    const populatedSession = await User.findById(req.user.userId)
      .populate('sessions.with', 'name email')
      .select('sessions');

    const createdSession = populatedSession.sessions[populatedSession.sessions.length - 1];

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      session: createdSession
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update session status
router.put('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, notes } = req.body;
    
    if (!status || !['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (pending, confirmed, completed, cancelled)'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the session
    const session = user.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Update session
    session.status = status;
    if (notes !== undefined) {
      session.notes = notes;
    }
    session.updatedAt = new Date();

    await user.save();

    // Update corresponding session in the other user's record
    const otherUser = await User.findById(session.with);
    if (otherUser) {
      const otherUserSession = otherUser.sessions.find(s => 
        s.with.toString() === req.user.userId && 
        s.date === session.date && 
        s.skill === session.skill
      );
      
      if (otherUserSession) {
        otherUserSession.status = status;
        if (notes !== undefined) {
          otherUserSession.notes = notes;
        }
        otherUserSession.updatedAt = new Date();
        await otherUser.save();
      }
    }

    res.json({
      success: true,
      message: 'Session updated successfully',
      session
    });

  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete session
router.delete('/:sessionId', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find the session
    const session = user.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Remove session from current user
    user.sessions.pull(sessionId);
    await user.save();

    // Remove corresponding session from other user
    const otherUser = await User.findById(session.with);
    if (otherUser) {
      otherUser.sessions.pull({ 
        with: req.user.userId, 
        date: session.date, 
        skill: session.skill 
      });
      await otherUser.save();
    }

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });

  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get session statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('sessions');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const sessions = user.sessions;
    
    const stats = {
      total: sessions.length,
      pending: sessions.filter(s => s.status === 'pending').length,
      confirmed: sessions.filter(s => s.status === 'confirmed').length,
      completed: sessions.filter(s => s.status === 'completed').length,
      cancelled: sessions.filter(s => s.status === 'cancelled').length
    };

    // Calculate completion rate
    const totalNonCancelled = stats.total - stats.cancelled;
    stats.completionRate = totalNonCancelled > 0 
      ? Math.round((stats.completed / totalNonCancelled) * 100) 
      : 0;

    // Get recent sessions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentSessions = sessions.filter(session => 
      new Date(session.date) >= thirtyDaysAgo
    ).length;

    stats.recentSessions = recentSessions;

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get session stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get upcoming sessions
router.get('/upcoming', authenticateToken, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const user = await User.findById(req.user.userId)
      .populate('sessions.with', 'name email')
      .select('sessions');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const now = new Date();
    const upcomingSessions = user.sessions
      .filter(session => 
        new Date(session.date) >= now && 
        ['pending', 'confirmed'].includes(session.status)
      )
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      sessions: upcomingSessions
    });

  } catch (error) {
    console.error('Get upcoming sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
