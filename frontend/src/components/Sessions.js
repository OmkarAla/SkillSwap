import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { sessionsAPI } from '../services/api';
import './Sessions.css';

const Sessions = () => {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    completionRate: 0,
    recentSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSession, setNewSession] = useState({
    withUserId: '',
    date: '',
    skill: '',
    notes: ''
  });

  // Load sessions data
  useEffect(() => {
    const loadSessionsData = async () => {
      try {
        setLoading(true);
        
        // Load sessions
        const sessionsResponse = await sessionsAPI.getSessions();
        if (sessionsResponse.success) {
          setSessions(sessionsResponse.sessions);
        }
        
        // Load stats
        const statsResponse = await sessionsAPI.getSessionStats();
        if (statsResponse.success) {
          setStats(statsResponse.stats);
        }
        
      } catch (error) {
        console.error('Error loading sessions data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessionsData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    
    try {
      const response = await sessionsAPI.createSession(newSession);
      if (response.success) {
        setShowCreateModal(false);
        setNewSession({ withUserId: '', date: '', skill: '', notes: '' });
        // Reload sessions
        const sessionsResponse = await sessionsAPI.getSessions();
        if (sessionsResponse.success) {
          setSessions(sessionsResponse.sessions);
        }
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleUpdateSession = async (sessionId, status) => {
    try {
      const response = await sessionsAPI.updateSession(sessionId, { status });
      if (response.success) {
        // Reload sessions
        const sessionsResponse = await sessionsAPI.getSessions();
        if (sessionsResponse.success) {
          setSessions(sessionsResponse.sessions);
        }
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const response = await sessionsAPI.deleteSession(sessionId);
        if (response.success) {
          // Reload sessions
          const sessionsResponse = await sessionsAPI.getSessions();
          if (sessionsResponse.success) {
            setSessions(sessionsResponse.sessions);
          }
        }
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  const filteredSessions = sessions.filter(session => {
    switch (activeTab) {
      case 'pending':
        return session.status === 'pending';
      case 'confirmed':
        return session.status === 'confirmed';
      case 'completed':
        return session.status === 'completed';
      case 'cancelled':
        return session.status === 'cancelled';
      default:
        return true;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="sessions-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-container">
      {/* Navigation */}
      <nav className="sessions-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <Link to="/dashboard" className="brand-link">SkillSwap</Link>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/matches" className="nav-link">Matches</Link>
            <Link to="/sessions" className="nav-link active">Sessions</Link>
            <Link to="/messages" className="nav-link">Messages</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="sessions-main">
        <div className="sessions-content">
          {/* Header */}
          <div className="sessions-header">
            <h1 className="sessions-title">My Sessions</h1>
            <p className="sessions-subtitle">Manage your skill exchange sessions</p>
            <button 
              className="create-session-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Schedule New Session
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <div className="stat-number">{stats.total}</div>
                <div className="stat-label">Total Sessions</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-number">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-number">{stats.completionRate}%</div>
                <div className="stat-label">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="sessions-tabs">
            <button 
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All ({stats.total})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              Pending ({stats.pending})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
              onClick={() => setActiveTab('confirmed')}
            >
              Confirmed ({stats.confirmed})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              Completed ({stats.completed})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cancelled' ? 'active' : ''}`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled ({stats.cancelled})
            </button>
          </div>

          {/* Sessions List */}
          <div className="sessions-list">
            {filteredSessions.length === 0 ? (
              <div className="no-sessions">
                <div className="no-sessions-icon">📅</div>
                <h3>No sessions found</h3>
                <p>You don't have any sessions in this category yet.</p>
                <button 
                  className="create-session-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  Schedule Your First Session
                </button>
              </div>
            ) : (
              filteredSessions.map(session => (
                <div key={session._id} className="session-card">
                  <div className="session-header">
                    <div className="session-info">
                      <h3 className="session-skill">{session.skill}</h3>
                      <p className="session-partner">with {session.with?.name || 'Unknown User'}</p>
                      <p className="session-date">📅 {new Date(session.date).toLocaleDateString()}</p>
                    </div>
                    <div className="session-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(session.status) }}
                      >
                        {session.status}
                      </span>
                    </div>
                  </div>
                  
                  {session.notes && (
                    <div className="session-notes">
                      <p><strong>Notes:</strong> {session.notes}</p>
                    </div>
                  )}
                  
                  <div className="session-actions">
                    {session.status === 'pending' && (
                      <>
                        <button 
                          className="action-btn confirm"
                          onClick={() => handleUpdateSession(session._id, 'confirmed')}
                        >
                          Confirm
                        </button>
                        <button 
                          className="action-btn cancel"
                          onClick={() => handleUpdateSession(session._id, 'cancelled')}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    
                    {session.status === 'confirmed' && (
                      <>
                        <button 
                          className="action-btn complete"
                          onClick={() => handleUpdateSession(session._id, 'completed')}
                        >
                          Mark Complete
                        </button>
                        <button 
                          className="action-btn cancel"
                          onClick={() => handleUpdateSession(session._id, 'cancelled')}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteSession(session._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Schedule New Session</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateSession} className="modal-form">
              <div className="form-group">
                <label className="form-label">Partner User ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSession.withUserId}
                  onChange={(e) => setNewSession(prev => ({ ...prev, withUserId: e.target.value }))}
                  placeholder="Enter user ID"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={newSession.date}
                  onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Skill</label>
                <input
                  type="text"
                  className="form-input"
                  value={newSession.skill}
                  onChange={(e) => setNewSession(prev => ({ ...prev, skill: e.target.value }))}
                  placeholder="e.g., Guitar Lessons"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  value={newSession.notes}
                  onChange={(e) => setNewSession(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes..."
                  rows={3}
                />
              </div>
              
              <div className="modal-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
