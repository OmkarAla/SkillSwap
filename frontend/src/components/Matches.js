import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Matches.css';

const Matches = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('rating');

  const categories = ['All', 'Technology', 'Programming', 'Design', 'Music', 'Art', 'Language', 'Lifestyle', 'Fitness', 'Business'];

  const matches = [
    {
      id: 1,
      name: 'Emma Wilson',
      avatar: '👩‍🎨',
      location: 'San Francisco, CA',
      distance: '2 miles away',
      rating: 4.9,
      sessionsCompleted: 45,
      skillsOffered: ['Painting', 'Digital Art', 'Illustration', 'Color Theory'],
      skillsSeeking: ['Cooking', 'Photography', 'Spanish'],
      bio: 'Professional digital artist with 5+ years experience. Love teaching creative techniques and learning new skills!',
      availability: 'Weekends',
      lastActive: '2 hours ago',
      isOnline: true
    },
    {
      id: 2,
      name: 'David Kim',
      avatar: '👨‍💻',
      location: 'San Francisco, CA',
      distance: '5 miles away',
      rating: 4.7,
      sessionsCompleted: 32,
      skillsOffered: ['Web Development', 'Python', 'Data Science', 'Machine Learning'],
      skillsSeeking: ['Spanish', 'Guitar', 'Cooking'],
      bio: 'Full-stack developer passionate about teaching programming. Always excited to learn new languages and instruments!',
      availability: 'Evenings',
      lastActive: '1 hour ago',
      isOnline: true
    },
    {
      id: 3,
      name: 'Lisa Brown',
      avatar: '👩‍🍳',
      location: 'San Francisco, CA',
      distance: '1 mile away',
      rating: 4.8,
      sessionsCompleted: 28,
      skillsOffered: ['Baking', 'Italian Cuisine', 'Wine Tasting', 'Meal Planning'],
      skillsSeeking: ['Yoga', 'Meditation', 'Photography'],
      bio: 'Chef and food enthusiast who loves sharing cooking secrets. Looking to expand my wellness and creative skills!',
      availability: 'Flexible',
      lastActive: '30 minutes ago',
      isOnline: true
    },
    {
      id: 4,
      name: 'Mike Rodriguez',
      avatar: '🎨',
      location: 'San Francisco, CA',
      distance: '3 miles away',
      rating: 4.6,
      sessionsCompleted: 19,
      skillsOffered: ['Graphic Design', 'Branding', 'UI/UX', 'Typography'],
      skillsSeeking: ['Guitar', 'Spanish', 'Cooking'],
      bio: 'Creative designer with a passion for visual storytelling. Always eager to learn new skills and share design knowledge!',
      availability: 'Weekdays',
      lastActive: '4 hours ago',
      isOnline: false
    },
    {
      id: 5,
      name: 'Sarah Johnson',
      avatar: '📸',
      location: 'San Francisco, CA',
      distance: '4 miles away',
      rating: 4.9,
      sessionsCompleted: 52,
      skillsOffered: ['Photography', 'Photo Editing', 'Lighting', 'Composition'],
      skillsSeeking: ['Cooking', 'Spanish', 'Yoga'],
      bio: 'Professional photographer specializing in portrait and event photography. Love teaching camera techniques!',
      availability: 'Weekends',
      lastActive: '6 hours ago',
      isOnline: false
    },
    {
      id: 6,
      name: 'Alex Chen',
      avatar: '🎵',
      location: 'San Francisco, CA',
      distance: '7 miles away',
      rating: 4.5,
      sessionsCompleted: 15,
      skillsOffered: ['Guitar', 'Piano', 'Music Theory', 'Songwriting'],
      skillsSeeking: ['Web Development', 'Photography', 'Cooking'],
      bio: 'Musician and music teacher with 8+ years experience. Passionate about sharing the joy of music!',
      availability: 'Evenings',
      lastActive: '1 day ago',
      isOnline: false
    }
  ];

  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         match.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         match.skillsSeeking.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || 
                           match.skillsOffered.some(skill => 
                             categories.includes(skill) && skill === selectedCategory
                           );
    
    return matchesSearch && matchesCategory;
  });

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'distance':
        return parseFloat(a.distance) - parseFloat(b.distance);
      case 'sessions':
        return b.sessionsCompleted - a.sessionsCompleted;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="matches-container">
      {/* Navigation */}
      <nav className="matches-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <Link to="/dashboard" className="brand-link">SkillSwap</Link>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/matches" className="nav-link active">Matches</Link>
            <Link to="/sessions" className="nav-link">Sessions</Link>
            <Link to="/messages" className="nav-link">Messages</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <button className="logout-btn">Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="matches-main">
        <div className="matches-content">
          {/* Header */}
          <div className="matches-header">
            <h1 className="matches-title">Find Your Perfect Match</h1>
            <p className="matches-subtitle">Discover amazing people to exchange skills with</p>
          </div>

          {/* Search and Filters */}
          <div className="search-section">
            <div className="search-bar">
              <div className="search-input-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name, skill, or interest..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="filters">
              <div className="filter-group">
                <label className="filter-label">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label className="filter-label">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                  <option value="sessions">Sessions Completed</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-info">
            <span className="results-count">{sortedMatches.length} matches found</span>
          </div>

          {/* Matches Grid */}
          <div className="matches-grid">
            {sortedMatches.map(match => (
              <div key={match.id} className="match-card">
                <div className="match-header">
                  <div className="match-avatar-container">
                    <div className="match-avatar">{match.avatar}</div>
                    {match.isOnline && <div className="online-indicator"></div>}
                  </div>
                  <div className="match-info">
                    <h3 className="match-name">{match.name}</h3>
                    <p className="match-location">📍 {match.location}</p>
                    <div className="match-meta">
                      <span className="match-distance">{match.distance}</span>
                      <span className="match-rating">⭐ {match.rating}</span>
                      <span className="match-sessions">{match.sessionsCompleted} sessions</span>
                    </div>
                  </div>
                </div>

                <div className="match-content">
                  <p className="match-bio">{match.bio}</p>
                  
                  <div className="skills-section">
                    <div className="skills-group">
                      <h4 className="skills-title">Can Teach</h4>
                      <div className="skills-tags">
                        {match.skillsOffered.map((skill, index) => (
                          <span key={index} className="skill-tag offering">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="skills-group">
                      <h4 className="skills-title">Wants to Learn</h4>
                      <div className="skills-tags">
                        {match.skillsSeeking.map((skill, index) => (
                          <span key={index} className="skill-tag seeking">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="match-details">
                    <div className="detail-item">
                      <span className="detail-label">Availability:</span>
                      <span className="detail-value">{match.availability}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Last Active:</span>
                      <span className="detail-value">{match.lastActive}</span>
                    </div>
                  </div>
                </div>

                <div className="match-actions">
                  <button className="action-btn primary">
                    <span className="btn-icon">💬</span>
                    Message
                  </button>
                  <button className="action-btn secondary">
                    <span className="btn-icon">📅</span>
                    Schedule
                  </button>
                  <button className="action-btn outline">
                    <span className="btn-icon">👁️</span>
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {sortedMatches.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3 className="no-results-title">No matches found</h3>
              <p className="no-results-text">
                Try adjusting your search terms or filters to find more matches.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;
