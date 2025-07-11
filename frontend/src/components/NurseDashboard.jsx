import React, { useState } from 'react';
import PredictionForm from './PredictionForm';
import ResultCard from './ResultCard';
import api from '../api';
import { FaSignOutAlt, FaUserNurse, FaClipboardList, FaCheckCircle, FaShareAlt } from 'react-icons/fa';
import './HomePage.css';

export default function NurseDashboard({ onLogout, user }) {
  const [showForm, setShowForm] = useState(false);
  const [result, setResult] = useState(null);
  const [predictionId, setPredictionId] = useState(null);
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    if (!predictionId || !result) return;
    const reportText = `Prediction result: ${result ? 'High risk of heart disease' : 'Low risk of heart disease'}`;
    await api.post('predictor/share_report/', {
      patient_name: user.username,
      report: reportText,
    });
    setShared(true);
  };

  return (
    <div className="homepage-container" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      <div className="homepage-bg"></div>
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      <nav className="homepage-navbar" style={{ justifyContent: 'space-between', display: 'flex' }}>
        <div className="navbar-container" style={{ justifyContent: 'space-between', width: '100%' }}>
          <div className="navbar-brand" style={{ gap: 8 }}>
            <FaUserNurse size={28} className="navbar-brand-icon" />
            <span className="navbar-brand-text">Nurse Dashboard</span>
          </div>
          <button className="nav-button nav-button-primary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '7rem 1.5rem 3rem', position: 'relative', zIndex: 10 }}>
        <section className="feature-card" style={{ marginBottom: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, color: '#be185d', fontWeight: 600 }}>
            <FaUserNurse style={{ color: '#3b82f6', fontSize: 24 }} />
            Welcome, {user.username} <span style={{ fontSize: 15, color: '#6b7280' }}>(Nurse)</span>
          </div>
        </section>
        {!showForm && !result && (
          <button
            className="hero-button"
            style={{ margin: '0 auto 2rem', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => setShowForm(true)}
          >
            <FaClipboardList /> Fill Prediction Form
          </button>
        )}
        {showForm && !result && (
          <PredictionForm
            onResult={(res, predId, formInputs) => {
              setResult(res);
              setPredictionId(predId);
              // If you want to store formInputs for ResultCard, do it here
            }}
            onShareReport={() => {
              // Handle report sharing - could show a success message or navigate
              console.log('Report shared successfully');
            }}
          />
        )}
        {result && (
          <div className="feature-card" style={{ marginBottom: 24, textAlign: 'center' }}>
            <ResultCard result={result} shared={shared} />
            {!shared && (
              <button
                className="hero-button"
                style={{ margin: '1.5rem auto 0', display: 'flex', alignItems: 'center', gap: 8 }}
                onClick={handleShare}
              >
                <FaShareAlt /> Share to Doctor
              </button>
            )}
            {shared && (
              <div style={{ marginTop: 16, color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FaCheckCircle /> Report shared with doctor!
              </div>
            )}
          </div>
        )}
      </main>
      <footer className="homepage-footer">
        &copy; {new Date().getFullYear()} Heart Disease Prediction Project. All rights reserved.
      </footer>
    </div>
  );
} 