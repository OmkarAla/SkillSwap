import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Profile.css';

const Profile = () => {
  const { logout } = useAuth();

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    personal: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      location: 'San Francisco, CA',
      bio: 'Passionate about learning and teaching. Love connecting with people through skill exchange!',
      profileImage: '👨‍💻'
    },
    skills: {
      offering: [
        { id: 1, name: 'Web Development', level: 'Expert', category: 'Technology' },
        { id: 2, name: 'JavaScript', level: 'Expert', category: 'Programming' },
        { id: 3, name: 'React', level: 'Advanced', category: 'Frontend' },
        { id: 4, name: 'Node.js', level: 'Advanced', category: 'Backend' },
        { id: 5, name: 'Guitar', level: 'Intermediate', category: 'Music' }
      ],
      seeking: [
        { id: 1, name: 'Spanish', level: 'Beginner', category: 'Language' },
        { id: 2, name: 'Photography', level: 'Beginner', category: 'Art' },
        { id: 3, name: 'Cooking', level: 'Intermediate', category: 'Lifestyle' }
      ]
    },
    preferences: {
      availability: 'Weekends',
      sessionLength: '1-2 hours',
      communication: 'Video calls preferred',
      location: 'Online or local meetups'
    }
  });

  const skillCategories = [
    'Technology', 'Programming', 'Frontend', 'Backend', 'Design',
    'Music', 'Art', 'Language', 'Lifestyle', 'Fitness', 'Business', 'Other'
  ];

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const handleInputChange = (section, field, value) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleLogout = () => {
    logout();
  };

  const handleSkillChange = (type, id, field, value) => {
    setProfileData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].map(skill =>
          skill.id === id ? { ...skill, [field]: value } : skill
        )
      }
    }));
  };

  const addSkill = (type) => {
    const newSkill = {
      id: Date.now(),
      name: '',
      level: 'Beginner',
      category: 'Other'
    };
    setProfileData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: [...prev.skills[type], newSkill]
      }
    }));
  };

  const removeSkill = (type, id) => {
    setProfileData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].filter(skill => skill.id !== id)
      }
    }));
  };

  return (
    <div className="profile-container">
      {/* Navigation */}
      <nav className="profile-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <Link to="/dashboard" className="brand-link">SkillSwap</Link>
          </div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/matches" className="nav-link">Matches</Link>
            <Link to="/sessions" className="nav-link">Sessions</Link>
            <Link to="/messages" className="nav-link">Messages</Link>
            <Link to="/profile" className="nav-link active">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="profile-main">
        <div className="profile-content">
          {/* Profile Header */}
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-image">{profileData.personal.profileImage}</div>
              <button className="avatar-edit-btn">📷</button>
            </div>
            <div className="profile-info">
              <h1 className="profile-name">
                {profileData.personal.firstName} {profileData.personal.lastName}
              </h1>
              <p className="profile-location">📍 {profileData.personal.location}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{profileData.skills.offering.length}</span>
                  <span className="stat-label">Skills Offered</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{profileData.skills.seeking.length}</span>
                  <span className="stat-label">Skills Learning</span>
                </div>
                <div className="stat">
                  <span className="stat-number">4.8</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
            </div>
            <div className="profile-actions">
              <button 
                className={`edit-btn ${isEditing ? 'active' : ''}`}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="profile-tabs">
            <button 
              className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveTab('personal')}
            >
              Personal Info
            </button>
            <button 
              className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              Skills & Interests
            </button>
            <button 
              className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              Preferences
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'personal' && (
              <div className="personal-info">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.personal.firstName}
                      onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.personal.lastName}
                      onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      value={profileData.personal.email}
                      onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={profileData.personal.location}
                      onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-textarea"
                    value={profileData.personal.bio}
                    onChange={(e) => handleInputChange('personal', 'bio', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="skills-content">
                {/* Skills Offering */}
                <div className="skills-section">
                  <div className="section-header">
                    <h3 className="section-title">Skills I Can Teach</h3>
                    {isEditing && (
                      <button 
                        className="add-skill-btn"
                        onClick={() => addSkill('offering')}
                      >
                        + Add Skill
                      </button>
                    )}
                  </div>
                  <div className="skills-grid">
                    {profileData.skills.offering.map(skill => (
                      <div key={skill.id} className="skill-card">
                        <div className="skill-info">
                          <input
                            type="text"
                            className="skill-name"
                            value={skill.name}
                            onChange={(e) => handleSkillChange('offering', skill.id, 'name', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Skill name"
                          />
                          <select
                            className="skill-level"
                            value={skill.level}
                            onChange={(e) => handleSkillChange('offering', skill.id, 'level', e.target.value)}
                            disabled={!isEditing}
                          >
                            {skillLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          <select
                            className="skill-category"
                            value={skill.category}
                            onChange={(e) => handleSkillChange('offering', skill.id, 'category', e.target.value)}
                            disabled={!isEditing}
                          >
                            {skillCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        {isEditing && (
                          <button 
                            className="remove-skill-btn"
                            onClick={() => removeSkill('offering', skill.id)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Seeking */}
                <div className="skills-section">
                  <div className="section-header">
                    <h3 className="section-title">Skills I Want to Learn</h3>
                    {isEditing && (
                      <button 
                        className="add-skill-btn"
                        onClick={() => addSkill('seeking')}
                      >
                        + Add Skill
                      </button>
                    )}
                  </div>
                  <div className="skills-grid">
                    {profileData.skills.seeking.map(skill => (
                      <div key={skill.id} className="skill-card">
                        <div className="skill-info">
                          <input
                            type="text"
                            className="skill-name"
                            value={skill.name}
                            onChange={(e) => handleSkillChange('seeking', skill.id, 'name', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Skill name"
                          />
                          <select
                            className="skill-level"
                            value={skill.level}
                            onChange={(e) => handleSkillChange('seeking', skill.id, 'level', e.target.value)}
                            disabled={!isEditing}
                          >
                            {skillLevels.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          <select
                            className="skill-category"
                            value={skill.category}
                            onChange={(e) => handleSkillChange('seeking', skill.id, 'category', e.target.value)}
                            disabled={!isEditing}
                          >
                            {skillCategories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        {isEditing && (
                          <button 
                            className="remove-skill-btn"
                            onClick={() => removeSkill('seeking', skill.id)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="preferences-content">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Availability</label>
                    <select
                      className="form-select"
                      value={profileData.preferences.availability}
                      onChange={(e) => handleInputChange('preferences', 'availability', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="Weekdays">Weekdays</option>
                      <option value="Weekends">Weekends</option>
                      <option value="Evenings">Evenings</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Session Length</label>
                    <select
                      className="form-select"
                      value={profileData.preferences.sessionLength}
                      onChange={(e) => handleInputChange('preferences', 'sessionLength', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="30 minutes">30 minutes</option>
                      <option value="1 hour">1 hour</option>
                      <option value="1-2 hours">1-2 hours</option>
                      <option value="2+ hours">2+ hours</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Communication Preference</label>
                    <select
                      className="form-select"
                      value={profileData.preferences.communication}
                      onChange={(e) => handleInputChange('preferences', 'communication', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="Video calls preferred">Video calls preferred</option>
                      <option value="In-person preferred">In-person preferred</option>
                      <option value="Either works">Either works</option>
                      <option value="Text chat only">Text chat only</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location Preference</label>
                    <select
                      className="form-select"
                      value={profileData.preferences.location}
                      onChange={(e) => handleInputChange('preferences', 'location', e.target.value)}
                      disabled={!isEditing}
                    >
                      <option value="Online only">Online only</option>
                      <option value="Local meetups only">Local meetups only</option>
                      <option value="Online or local meetups">Online or local meetups</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
