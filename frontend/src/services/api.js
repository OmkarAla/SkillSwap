// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Register user
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Verify token
  verify: async () => {
    return apiRequest('/auth/verify');
  },

  // Logout user
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

// User API
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Update user skills
  updateSkills: async (skillsData) => {
    return apiRequest('/users/skills', {
      method: 'PUT',
      body: JSON.stringify(skillsData),
    });
  },

  // Get user by ID
  getUser: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  // Get user statistics
  getUserStats: async (userId) => {
    return apiRequest(`/users/stats/${userId}`);
  },

  // Rate a user
  rateUser: async (ratingData) => {
    return apiRequest('/users/rate', {
      method: 'POST',
      body: JSON.stringify(ratingData),
    });
  },
};

// Matches API
export const matchesAPI = {
  // Get potential matches
  getMatches: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/matches?${queryString}`);
  },

  // Get suggested matches
  getSuggestedMatches: async (limit = 5) => {
    return apiRequest(`/matches/suggested?limit=${limit}`);
  },

  // Get match by ID
  getMatch: async (matchId) => {
    return apiRequest(`/matches/${matchId}`);
  },

  // Get available categories
  getCategories: async () => {
    return apiRequest('/matches/categories/list');
  },
};

// Sessions API
export const sessionsAPI = {
  // Get all sessions
  getSessions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/sessions?${queryString}`);
  },

  // Create a new session
  createSession: async (sessionData) => {
    return apiRequest('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },

  // Update session
  updateSession: async (sessionId, updateData) => {
    return apiRequest(`/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete session
  deleteSession: async (sessionId) => {
    return apiRequest(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  },

  // Get session statistics
  getSessionStats: async () => {
    return apiRequest('/sessions/stats/overview');
  },

  // Get upcoming sessions
  getUpcomingSessions: async (limit = 5) => {
    return apiRequest(`/sessions/upcoming?limit=${limit}`);
  },
};

// Messages API
export const messagesAPI = {
  // Get all conversations
  getConversations: async () => {
    return apiRequest('/messages/conversations');
  },

  // Get conversation with specific user
  getConversation: async (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/messages/conversation/${userId}?${queryString}`);
  },

  // Send a message
  sendMessage: async (messageData) => {
    return apiRequest('/messages/send', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    return apiRequest(`/messages/read/${messageId}`, {
      method: 'PUT',
    });
  },

  // Get unread count
  getUnreadCount: async () => {
    return apiRequest('/messages/unread/count');
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    return apiRequest(`/messages/${messageId}`, {
      method: 'DELETE',
    });
  },

  // Search messages
  searchMessages: async (query, params = {}) => {
    const searchParams = { query, ...params };
    const queryString = new URLSearchParams(searchParams).toString();
    return apiRequest(`/messages/search?${queryString}`);
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiRequest('/health');
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  matches: matchesAPI,
  sessions: sessionsAPI,
  messages: messagesAPI,
  health: healthAPI,
};
