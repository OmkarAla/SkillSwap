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

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        offers: user.offers,
        seeks: user.seeks,
        location: user.location,
        sessions: user.sessions,
        ratings: user.ratings,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, location, bio } = req.body;
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        offers: user.offers,
        seeks: user.seeks,
        location: user.location,
        sessions: user.sessions,
        ratings: user.ratings,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update skills (offers and seeks)
router.put('/skills', authenticateToken, async (req, res) => {
  try {
    const { offers, seeks } = req.body;
    
    const updateData = {};
    if (offers !== undefined) updateData.offers = offers;
    if (seeks !== undefined) updateData.seeks = seeks;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Skills updated successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        offers: user.offers,
        seeks: user.seeks,
        location: user.location,
        sessions: user.sessions,
        ratings: user.ratings,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Update skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user by ID (for viewing other profiles)
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password -googleCalendarToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        offers: user.offers,
        seeks: user.seeks,
        location: user.location,
        sessions: user.sessions,
        ratings: user.ratings,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user statistics
router.get('/stats/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('sessions ratings offers seeks');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate statistics
    const completedSessions = user.sessions.filter(session => session.status === 'completed').length;
    const averageRating = user.ratings.length > 0 
      ? user.ratings.reduce((sum, rating) => sum + rating.score, 0) / user.ratings.length 
      : 0;

    const stats = {
      skillsOffered: user.offers.length,
      skillsSeeking: user.seeks.length,
      sessionsCompleted: completedSessions,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: user.ratings.length
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Rate a user
router.post('/rate', authenticateToken, async (req, res) => {
  try {
    const { userId, score, comment } = req.body;
    
    if (!userId || !score || score < 1 || score > 5) {
      return res.status(400).json({
        success: false,
        message: 'Valid userId and score (1-5) are required'
      });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already rated by this user
    const existingRating = targetUser.ratings.find(
      rating => rating.from.toString() === req.user.userId
    );

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this user'
      });
    }

    // Add rating
    targetUser.ratings.push({
      from: req.user.userId,
      score,
      comment: comment || ''
    });

    await targetUser.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Rate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
