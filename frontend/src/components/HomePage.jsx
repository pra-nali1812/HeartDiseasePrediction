import React from 'react';
import { FaHeartbeat, FaArrowRight } from 'react-icons/fa';
import './HomePage.css';

export default function HomePage({ onLogin, onAbout, onAppointment }) {
  return (
    <div className="homepage-container">
      {/* Animated background gradient */}
      <div className="homepage-bg"></div>
      
      {/* Floating elements */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      
      {/* Navbar */}
      <nav className="homepage-navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <FaHeartbeat size={32} className="navbar-brand-icon" />
            <span className="navbar-brand-text">Heart Disease Prediction</span>
          </div>
          <div className="navbar-actions">
            <button
              className="nav-button nav-button-secondary"
              onClick={onAbout}
            >
              About Us
            </button>
            <button
              className="nav-button nav-button-primary"
              onClick={onLogin}
            >
              Login
            </button>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">AI-Powered Heart Disease Prediction</h1>
          <p className="hero-description">
            Advanced machine learning technology to assess your <span className="hero-highlight">heart disease risk</span>.<br />
            Get instant predictions with 95% accuracy using medical-grade algorithms.
          </p>
          <button
            className="hero-button"
            onClick={onAppointment}
          >
            Book Heart Assessment <FaArrowRight />
          </button>
        </div>
        <div className="hero-image-container">
          <img
            src="https://images.unsplash.com/photo-1516748088067-ed3ba8a42be5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Heart Disease Prediction Technology"
            className="hero-image"
            onError={e => { 
              e.target.onerror = null; 
              // Fallback to medical technology
              e.target.src = 'https://images.unsplash.com/photo-1516748088067-ed3ba8a42be5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
            }}
          />
          {/* Fallback SVG heart if both images fail */}
          <svg 
            className="hero-image-fallback" 
            viewBox="0 0 100 100" 
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'none' }}
          >
            <path 
              d="M50 88.9c-1.1 0-2.2-0.3-3.2-0.8C25.8 75.7 10 60.4 10 42.5c0-12.3 9.7-22 22-22 6.8 0 13.3 3.1 18 8.4 4.7-5.3 11.2-8.4 18-8.4 12.3 0 22 9.7 22 22 0 17.9-15.8 33.2-36.8 45.6-1 0.5-2.1 0.8-3.2 0.8z" 
              fill="#ec4899"
            />
          </svg>
        </div>
      </div>
      
      {/* Medical Features Section */}
      <section className="medical-features">
        <div className="features-container">
          <h2 className="features-title">Why Choose Our Heart Disease Prediction System?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Analysis</h3>
              <p>Advanced machine learning algorithms trained on thousands of medical records for accurate predictions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Instant Results</h3>
              <p>Get your heart disease risk assessment in seconds, not days or weeks.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your medical data is encrypted and protected with hospital-grade security.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍⚕️</div>
              <h3>Medical Expertise</h3>
              <p>Developed by cardiologists and data scientists for clinical accuracy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        &copy; {new Date().getFullYear()} Heart Disease Prediction Project. All rights reserved.
      </footer>
    </div>
  );
}
