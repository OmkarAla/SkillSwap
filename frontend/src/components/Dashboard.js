import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, matchesAPI, sessionsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats, setUserStats] = useState({
    skillsOffered: 0,
    skillsLearning: 0,
    sessionsCompleted: 0,
    rating: 0
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [suggestedMatches, setSuggestedMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load user stats
        if (user?.id) {
          try {
            const statsResponse = await userAPI.getUserStats(user.id);
            if (statsResponse && statsResponse.success) {
              setUserStats(statsResponse.stats || {
                skillsOffered: 0,
                skillsLearning: 0,
                sessionsCompleted: 0,
                rating: 0
              });
            }
          } catch (error) {
            console.error('Error loading user stats:', error);
          }
        }
        
        // Load recent sessions
        try {
          const sessionsResponse = await sessionsAPI.getSessions({ limit: 3 });
          if (sessionsResponse && sessionsResponse.success) {
            setRecentSessions(sessionsResponse.sessions || []);
          }
        } catch (error) {
          console.error('Error loading sessions:', error);
          setRecentSessions([]);
        }
        
        // Load suggested matches
        try {
          const matchesResponse = await matchesAPI.getSuggestedMatches(3);
          if (matchesResponse && matchesResponse.success) {
            setSuggestedMatches(matchesResponse.matches || []);
          }
        } catch (error) {
          console.error('Error loading matches:', error);
          setSuggestedMatches([]);
        }
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <Link to="/dashboard" className="brand-link">SkillSwap</Link>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link active">Dashboard</Link>
            <Link to="/matches" className="nav-link">Matches</Link>
            <Link to="/sessions" className="nav-link">Sessions</Link>
            <Link to="/messages" className="nav-link">Messages</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user?.name || 'User'}! 👋</h1>
            <p className="welcome-subtitle">Ready to continue your skill exchange journey?</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-number">{userStats.skillsOffered}</div>
                <div className="stat-label">Skills Offered</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-number">{userStats.skillsLearning}</div>
                <div className="stat-label">Skills Learning</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-number">{userStats.sessionsCompleted}</div>
                <div className="stat-label">Sessions Completed</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-number">{userStats.rating}</div>
                <div className="stat-label">Your Rating</div>
              </div>
            </div>
          </div>

          {/* Main Dashboard Grid */}
          <div className="dashboard-grid">
            {/* Recent Sessions */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Recent Sessions</h3>
                <Link to="/sessions" className="card-link">View All</Link>
              </div>
              <div className="card-content">
                {recentSessions && recentSessions.length > 0 ? recentSessions.map(session => (
                  <div key={session.id || session._id} className="session-item">
                    <div className="session-info">
                      <div className="session-partner">{session.partner || 'Unknown Partner'}</div>
                      <div className="session-skill">{session.skill || 'Unknown Skill'}</div>
                      <div className="session-date">{session.date || 'No date'}</div>
                    </div>
                    <div className="session-status">
                      <span className={`status-badge ${session.status || 'pending'}`}>
                        {session.status || 'pending'}
                      </span>
                      {session.rating && (
                        <div className="session-rating">
                          {'★'.repeat(session.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="no-sessions">
                    <p>No recent sessions found. Start by scheduling your first session!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Suggested Matches */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Suggested Matches</h3>
                <Link to="/matches" className="card-link">View All</Link>
              </div>
              <div className="card-content">
                {suggestedMatches && suggestedMatches.length > 0 ? suggestedMatches.map(match => (
                  <div key={match.id || match._id} className="match-item">
                    <div className="match-avatar">{match.avatar || '👤'}</div>
                    <div className="match-info">
                      <div className="match-name">{match.name || 'Unknown User'}</div>
                      <div className="match-skills">
                        <span className="skill-tag">Offers: {match.skillsOffered?.[0] || 'N/A'}</span>
                        <span className="skill-tag">Seeks: {match.skillsSeeking?.[0] || 'N/A'}</span>
                      </div>
                      <div className="match-meta">
                        <span className="match-rating">⭐ {match.rating || '0'}</span>
                        <span className="match-distance">{match.distance || 'Unknown'}</span>
                      </div>
                    </div>
                    <button className="connect-btn">Connect</button>
                  </div>
                )) : (
                  <div className="no-matches">
                    <p>No suggested matches found. Check back later!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Quick Actions</h3>
              </div>
              <div className="card-content">
                <div className="action-grid">
                  <Link to="/profile" className="action-btn">
                    <div className="action-icon">👤</div>
                    <div className="action-text">Update Profile</div>
                  </Link>
                  <Link to="/matches" className="action-btn">
                    <div className="action-icon">🔍</div>
                    <div className="action-text">Find Matches</div>
                  </Link>
                  <Link to="/sessions" className="action-btn">
                    <div className="action-icon">📅</div>
                    <div className="action-text">Schedule Session</div>
                  </Link>
                  <Link to="/messages" className="action-btn">
                    <div className="action-icon">💬</div>
                    <div className="action-text">View Messages</div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Community Stats */}
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">Community Stats</h3>
              </div>
              <div className="card-content">
                <div className="community-stats">
                  <div className="community-stat">
                    <div className="stat-value">10,247</div>
                    <div className="stat-desc">Active Users</div>
                  </div>
                  <div className="community-stat">
                    <div className="stat-value">52,891</div>
                    <div className="stat-desc">Free Sessions</div>
                  </div>
                  <div className="community-stat">
                    <div className="stat-value">95%</div>
                    <div className="stat-desc">Success Rate</div>
                  </div>
                </div>
                <div className="community-cta">
                  <p>Join our growing community of learners and teachers!</p>
                  <Link to="/matches" className="community-btn">Explore Now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
