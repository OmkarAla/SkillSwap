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

// Get potential matches
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, category, sortBy = 'rating', limit = 20, page = 1 } = req.query;
    
    // Get current user's skills
    const currentUser = await User.findById(req.user.userId).select('offers seeks');
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Build match criteria
    const matchCriteria = {
      _id: { $ne: req.user.userId } // Exclude current user
    };

    // Add search criteria
    if (search) {
      matchCriteria.$or = [
        { name: { $regex: search, $options: 'i' } },
        { offers: { $in: [new RegExp(search, 'i')] } },
        { seeks: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Add category filter
    if (category && category !== 'All') {
      matchCriteria.offers = { $in: [new RegExp(category, 'i')] };
    }

    // Find potential matches
    const users = await User.find(matchCriteria)
      .select('-password -googleCalendarToken')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Calculate compatibility scores and add additional data
    const matches = users.map(user => {
      // Calculate compatibility based on skill overlap
      const offersMatch = user.offers.filter(skill => 
        currentUser.seeks.some(seeking => 
          seeking.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(seeking.toLowerCase())
        )
      ).length;

      const seeksMatch = user.seeks.filter(skill => 
        currentUser.offers.some(offering => 
          offering.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(offering.toLowerCase())
        )
      ).length;

      const compatibilityScore = (offersMatch + seeksMatch) / (user.offers.length + user.seeks.length) * 100;

      // Calculate average rating
      const averageRating = user.ratings.length > 0 
        ? user.ratings.reduce((sum, rating) => sum + rating.score, 0) / user.ratings.length 
        : 0;

      // Calculate completed sessions
      const completedSessions = user.sessions.filter(session => session.status === 'completed').length;

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        offers: user.offers,
        seeks: user.seeks,
        location: user.location,
        averageRating: Math.round(averageRating * 10) / 10,
        completedSessions,
        compatibilityScore: Math.round(compatibilityScore),
        createdAt: user.createdAt
      };
    });

    // Sort matches
    let sortedMatches = matches;
    switch (sortBy) {
      case 'rating':
        sortedMatches = matches.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'compatibility':
        sortedMatches = matches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
        break;
      case 'sessions':
        sortedMatches = matches.sort((a, b) => b.completedSessions - a.completedSessions);
        break;
      case 'name':
        sortedMatches = matches.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        sortedMatches = matches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    res.json({
      success: true,
      matches: sortedMatches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: sortedMatches.length,
        pages: Math.ceil(sortedMatches.length / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get suggested matches (high compatibility)
router.get('/suggested', authenticateToken, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    // Get current user's skills
    const currentUser = await User.findById(req.user.userId).select('offers seeks');
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Find users with high skill overlap
    const users = await User.find({
      _id: { $ne: req.user.userId },
      $or: [
        { offers: { $in: currentUser.seeks } },
        { seeks: { $in: currentUser.offers } }
      ]
    })
    .select('-password -googleCalendarToken')
    .limit(parseInt(limit) * 2); // Get more to filter

    // Calculate compatibility and filter
    const suggestedMatches = users.map(user => {
      const offersMatch = user.offers.filter(skill => 
        currentUser.seeks.some(seeking => 
          seeking.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(seeking.toLowerCase())
        )
      ).length;

      const seeksMatch = user.seeks.filter(skill => 
        currentUser.offers.some(offering => 
          offering.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(offering.toLowerCase())
        )
      ).length;

      const compatibilityScore = (offersMatch + seeksMatch) / (user.offers.length + user.seeks.length) * 100;

      const averageRating = user.ratings.length > 0 
        ? user.ratings.reduce((sum, rating) => sum + rating.score, 0) / user.ratings.length 
        : 0;

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        offers: user.offers,
        seeks: user.seeks,
        location: user.location,
        averageRating: Math.round(averageRating * 10) / 10,
        compatibilityScore: Math.round(compatibilityScore),
        createdAt: user.createdAt
      };
    })
    .filter(match => match.compatibilityScore > 20) // Only high compatibility
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
    .slice(0, parseInt(limit));

    res.json({
      success: true,
      matches: suggestedMatches
    });

  } catch (error) {
    console.error('Get suggested matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get match by ID
router.get('/:matchId', authenticateToken, async (req, res) => {
  try {
    const { matchId } = req.params;
    
    const user = await User.findById(matchId).select('-password -googleCalendarToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate compatibility with current user
    const currentUser = await User.findById(req.user.userId).select('offers seeks');
    
    const offersMatch = user.offers.filter(skill => 
      currentUser.seeks.some(seeking => 
        seeking.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(seeking.toLowerCase())
      )
    ).length;

    const seeksMatch = user.seeks.filter(skill => 
      currentUser.offers.some(offering => 
        offering.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(offering.toLowerCase())
      )
    ).length;

    const compatibilityScore = (offersMatch + seeksMatch) / (user.offers.length + user.seeks.length) * 100;

    const averageRating = user.ratings.length > 0 
      ? user.ratings.reduce((sum, rating) => sum + rating.score, 0) / user.ratings.length 
      : 0;

    const completedSessions = user.sessions.filter(session => session.status === 'completed').length;

    const matchData = {
      id: user._id,
      name: user.name,
      email: user.email,
      offers: user.offers,
      seeks: user.seeks,
      location: user.location,
      averageRating: Math.round(averageRating * 10) / 10,
      completedSessions,
      compatibilityScore: Math.round(compatibilityScore),
      ratings: user.ratings,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      match: matchData
    });

  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get available skill categories
router.get('/categories/list', authenticateToken, async (req, res) => {
  try {
    // Get all unique skills from all users
    const users = await User.find({}, 'offers seeks');
    
    const allSkills = new Set();
    users.forEach(user => {
      user.offers.forEach(skill => allSkills.add(skill));
      user.seeks.forEach(skill => allSkills.add(skill));
    });

    const categories = Array.from(allSkills).sort();

    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
