const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Middleware to check if user is online
const updateUserActivity = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        isOnline: true,
        lastActive: new Date()
      });
    }
    next();
  } catch (error) {
    console.error('Update activity error:', error);
    next(); // Continue even if activity update fails
  }
};

// Middleware to validate request data
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details[0].message
      });
    }
    next();
  };
};

// Rate limiting middleware (simple in-memory implementation)
const rateLimitMap = new Map();

const rateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const clientId = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.timestamp < windowStart) {
        rateLimitMap.delete(key);
      }
    }

    // Check current client
    const clientData = rateLimitMap.get(clientId);
    
    if (!clientData) {
      rateLimitMap.set(clientId, { count: 1, timestamp: now });
      return next();
    }

    if (clientData.timestamp < windowStart) {
      rateLimitMap.set(clientId, { count: 1, timestamp: now });
      return next();
    }

    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }

    clientData.count++;
    next();
  };
};

module.exports = {
  authenticateToken,
  updateUserActivity,
  validateRequest,
  rateLimit
};
