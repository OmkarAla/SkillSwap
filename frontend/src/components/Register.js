import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Register.css';

const Register = () => {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    skillsOffered: '',
    skillsSought: '',
    location: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.skillsOffered.trim()) {
      newErrors.skillsOffered = 'Please specify at least one skill you can offer';
    }
    
    if (!formData.skillsSought.trim()) {
      newErrors.skillsSought = 'Please specify at least one skill you want to learn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // TODO: Implement actual registration API call
      console.log('Registration attempt:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For now, just show success message
      alert('Registration successful! Welcome to SkillSwap! (This is a demo)');
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Header */}
        <div className="register-header">
          <Link to="/" className="register-brand">
            SkillSwap
          </Link>
          <h2 className="register-title">
            Create your account
          </h2>
          <p className="register-subtitle">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="alert alert-error">
              {errors.general}
            </div>
          )}

          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="section-title">Personal Information</h3>
            
            <div className="form-grid">
              {/* First Name */}
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  First Name <span className="required">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${errors.firstName ? 'error' : ''}`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="form-error">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">
                  Last Name <span className="required">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${errors.lastName ? 'error' : ''}`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="form-error">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="form-error">{errors.email}</p>
              )}
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
                placeholder="City, State/Country (optional)"
              />
            </div>
          </div>

          {/* Account Security Section */}
          <div className="form-section">
            <h3 className="section-title">Account Security</h3>
            
            <div className="form-grid">
              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="form-error">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="form-error">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="form-section skills-section">
            <h3 className="section-title">Skills & Interests</h3>
            
            {/* Skills Offered */}
            <div className="form-group">
              <label htmlFor="skillsOffered" className="form-label">
                Skills I Can Offer <span className="required">*</span>
              </label>
              <textarea
                id="skillsOffered"
                name="skillsOffered"
                rows={3}
                value={formData.skillsOffered}
                onChange={handleChange}
                className={`form-textarea ${errors.skillsOffered ? 'error' : ''}`}
                placeholder="e.g., Guitar lessons, Cooking tips, Spanish tutoring, Photography guidance..."
              />
              {errors.skillsOffered && (
                <p className="form-error">{errors.skillsOffered}</p>
              )}
            </div>

            {/* Skills Sought */}
            <div className="form-group">
              <label htmlFor="skillsSought" className="form-label">
                Skills I Want to Learn <span className="required">*</span>
              </label>
              <textarea
                id="skillsSought"
                name="skillsSought"
                rows={3}
                value={formData.skillsSought}
                onChange={handleChange}
                className={`form-textarea ${errors.skillsSought ? 'error' : ''}`}
                placeholder="e.g., Piano lessons, Web development, Yoga, French language..."
              />
              {errors.skillsSought && (
                <p className="form-error">{errors.skillsSought}</p>
              )}
            </div>

            {/* Bio */}
            <div className="form-group">
              <label htmlFor="bio" className="form-label">
                About Me
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Tell us a bit about yourself, your experience, and what makes you excited about skill sharing..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-footer">
            <div className="terms-text">
              By creating an account, you agree to our{' '}
              <a href="#" className="terms-link">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="terms-link">
                Privacy Policy
              </a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Back to Home */}
        <div className="back-link">
          <Link 
            to="/" 
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
