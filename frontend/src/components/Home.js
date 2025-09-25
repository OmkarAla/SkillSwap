import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Get all sections for perspective zoom effect
      const sections = document.querySelectorAll('section');
      
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        
        // Calculate how much of the section is visible
        const visibleHeight = Math.min(windowHeight, sectionHeight);
        const scrollProgress = Math.max(0, Math.min(1, 
          (windowHeight - sectionTop) / visibleHeight
        ));
        
        // Perspective zoom effect
        if (scrollProgress > 0 && scrollProgress < 1) {
          // Scale from 0.8 to 1.0 as section comes into view
          const scale = 0.8 + (scrollProgress * 0.2);
          // Opacity from 0 to 1
          const opacity = scrollProgress;
          // Slight translateY for smooth entrance
          const translateY = (1 - scrollProgress) * 50;
          
          section.style.transform = `scale(${scale}) translateY(${translateY}px)`;
          section.style.opacity = opacity;
          section.style.filter = `blur(${(1 - scrollProgress) * 2}px)`;
        } else if (scrollProgress >= 1) {
          // Section is fully in view
          section.style.transform = 'scale(1) translateY(0px)';
          section.style.opacity = '1';
          section.style.filter = 'blur(0px)';
        } else {
          // Section is not yet visible
          section.style.transform = 'scale(0.8) translateY(50px)';
          section.style.opacity = '0';
          section.style.filter = 'blur(2px)';
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial call to set initial states
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* Floating Navigation */}
      <nav className="floating-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <h1 className="brand-text">SkillSwap</h1>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-button">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with 3D Effects */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Exchange Skills,</span>
              <span className="title-line gradient-text">Build Community</span>
            </h1>
            <p className="hero-subtitle">
              Connect with people who have skills you want to learn, and share your own expertise. 
              A completely free peer-to-peer platform where knowledge flows freely.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn-primary-3d">
                <span className="btn-text">Start Learning & Teaching</span>
                <div className="btn-shine"></div>
              </Link>
              <Link to="/login" className="btn-secondary-3d">
                <span className="btn-text">Sign In</span>
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="skill-cards">
              <div className="skill-card card-1">
                <div className="card-icon">🎨</div>
                <span>Design</span>
              </div>
              <div className="skill-card card-2">
                <div className="card-icon">💻</div>
                <span>Code</span>
              </div>
              <div className="skill-card card-3">
                <div className="card-icon">🎵</div>
                <span>Music</span>
              </div>
              <div className="skill-card card-4">
                <div className="card-icon">🍳</div>
                <span>Cook</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with 3D Cards */}
      <section className="features-section" ref={featuresRef}>
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">How SkillSwap Works</h2>
            <p className="features-subtitle">Simple steps to start your skill exchange journey</p>
          </div>
          
          <div className="features-grid-3d">
            <div className="feature-card-3d">
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-icon-3d">
                    <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="card-title">Create Profile</h3>
                  <p className="card-description">Specify skills you offer and skills you want to learn</p>
                </div>
                <div className="card-back">
                  <div className="card-glow"></div>
                </div>
              </div>
            </div>

            <div className="feature-card-3d">
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-icon-3d">
                    <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="card-title">Find Matches</h3>
                  <p className="card-description">Discover users with complementary skills</p>
                </div>
                <div className="card-back">
                  <div className="card-glow"></div>
                </div>
              </div>
            </div>

            <div className="feature-card-3d">
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-icon-3d">
                    <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="card-title">Schedule Sessions</h3>
                  <p className="card-description">Arrange skill exchange sessions with calendar integration</p>
                </div>
                <div className="card-back">
                  <div className="card-glow"></div>
                </div>
              </div>
            </div>

            <div className="feature-card-3d">
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-icon-3d">
                    <svg className="icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="card-title">Rate & Review</h3>
                  <p className="card-description">Build trust through feedback and ratings</p>
                </div>
                <div className="card-back">
                  <div className="card-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-header">
            <h2 className="stats-title">Join Our Growing Community</h2>
            <p className="stats-subtitle">Numbers that speak for themselves</p>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Free Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">What Our Users Say</h2>
            <p className="testimonials-subtitle">Real stories from real people</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">"SkillSwap helped me learn guitar while teaching someone else coding - all completely free! It's amazing how knowledge flows both ways!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">👨‍💻</div>
                  <div className="author-info">
                    <div className="author-name">Alex Chen</div>
                    <div className="author-role">Software Developer</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">"I've been able to improve my cooking skills while sharing my photography expertise - all for free! The community is incredible!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">👩‍🍳</div>
                  <div className="author-info">
                    <div className="author-name">Sarah Johnson</div>
                    <div className="author-role">Photographer</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">"The best part is meeting people who are passionate about learning - and it's completely free! Every session feels like a new adventure!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">🎨</div>
                  <div className="author-info">
                    <div className="author-name">Mike Rodriguez</div>
                    <div className="author-role">Graphic Designer</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with 3D Effects */}
      <section className="cta-section-3d">
        <div className="cta-background">
          <div className="cta-shapes">
            <div className="cta-shape cta-shape-1"></div>
            <div className="cta-shape cta-shape-2"></div>
          </div>
        </div>
        <div className="cta-content">
          <h2 className="cta-title-3d">Ready to Start Your Free Skill Exchange Journey?</h2>
          <p className="cta-subtitle-3d">Join thousands of learners and teachers in our completely free community of knowledge sharing</p>
          <Link to="/register" className="btn-cta-3d">
            <span className="btn-text">Join SkillSwap Today</span>
            <div className="btn-particles"></div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-3d">
        <div className="footer-content">
          <div className="footer-brand-3d">
            <h3 className="footer-title">SkillSwap</h3>
            <p className="footer-tagline">Where skills meet opportunity</p>
          </div>
          <div className="footer-links-3d">
            <Link to="/login" className="footer-link-3d">Login</Link>
            <Link to="/register" className="footer-link-3d">Register</Link>
            <a href="#" className="footer-link-3d">About</a>
            <a href="#" className="footer-link-3d">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;