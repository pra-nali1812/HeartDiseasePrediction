import React from 'react';
import { FaHeartbeat, FaUserMd, FaRobot, FaShieldAlt, FaEnvelope } from 'react-icons/fa';
import './HomePage.css';

export default function AboutUs({ onHome }) {
  return (
    <div className="homepage-container" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      <div className="homepage-bg"></div>
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      <nav className="homepage-navbar">
        <div className="navbar-container">
          <div className="navbar-brand" style={{ cursor: 'pointer' }} onClick={onHome}>
            <FaHeartbeat size={32} className="navbar-brand-icon" />
            <span className="navbar-brand-text">Heart Disease Prediction</span>
          </div>
        </div>
      </nav>
      <main className="aboutus-main" style={{ maxWidth: 900, margin: '0 auto', padding: '7rem 1.5rem 3rem', position: 'relative', zIndex: 10 }}>
        <section style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="hero-title" style={{ marginBottom: 12 }}>About Us</h1>
          <p className="hero-description" style={{ maxWidth: 600, margin: '0 auto' }}>
            Our mission is to empower individuals and healthcare professionals with advanced, AI-powered tools for early detection and risk assessment of heart disease. We believe technology and medical expertise together can save lives.
          </p>
        </section>
        <section className="aboutus-features features-grid" style={{ marginBottom: '2.5rem' }}>
          <div className="feature-card">
            <div className="feature-icon"><FaRobot /></div>
            <h3>AI-Driven Insights</h3>
            <p>Our platform leverages state-of-the-art machine learning models trained on thousands of real medical records to deliver accurate, instant heart disease risk predictions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaUserMd /></div>
            <h3>Medical Expertise</h3>
            <p>Developed in collaboration with cardiologists and data scientists, our system is designed for clinical reliability and user trust.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaShieldAlt /></div>
            <h3>Privacy & Security</h3>
            <p>We use hospital-grade encryption and privacy standards to ensure your medical data is always safe and confidential.</p>
          </div>
        </section>

        <section style={{ textAlign: 'center' }}>
          <h2 className="features-title" style={{ fontSize: '2rem', marginBottom: 8 }}>Contact Us</h2>
          <p className="hero-description" style={{ marginBottom: 12 }}>
            Have questions, suggestions, or want to collaborate?
          </p>
          <a href="mailto:info@heartpredict.ai" className="hero-button" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <FaEnvelope /> Email Us
          </a>
        </section>
      </main>
      <footer className="homepage-footer">
        &copy; {new Date().getFullYear()} Heart Disease Prediction Project. All rights reserved.
      </footer>
    </div>
  );
} 