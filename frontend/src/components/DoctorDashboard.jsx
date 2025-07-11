import React, { useEffect, useState } from 'react';
import api from '../api';
import { FaSignOutAlt, FaSearch, FaUserMd, FaUser, FaRegFileAlt, FaShareAlt } from 'react-icons/fa';
import './HomePage.css';

export default function DoctorDashboard({ onLogout }) {
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('predictor/doctor_reports/').then(res => setReports(res.data));
  }, []);

  const filteredReports = reports.filter(r =>
    r.patient_name.toLowerCase().includes(search.toLowerCase())
  );

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
            <FaUserMd size={28} className="navbar-brand-icon" />
            <span className="navbar-brand-text">Doctor Dashboard</span>
          </div>
          <button className="nav-button nav-button-primary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '7rem 1.5rem 3rem', position: 'relative', zIndex: 10 }}>
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <FaSearch style={{ color: '#ec4899', fontSize: 20 }} />
            <input
              type="text"
              placeholder="Search by patient name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: '0.5rem 1rem',
                borderRadius: 9999,
                border: '1.5px solid #ec4899',
                outline: 'none',
                fontSize: 16,
                boxShadow: '0 2px 8px rgba(236,72,153,0.07)',
                transition: 'border 0.2s',
                background: 'rgba(255,255,255,0.95)',
                color: '#be185d',
                maxWidth: 350
              }}
            />
          </div>
          <h2 className="features-title" style={{ textAlign: 'left', fontSize: '2rem', marginBottom: 8 }}>Patient Reports</h2>
        </section>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredReports.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: 18, textAlign: 'center', gridColumn: '1/-1' }}>
              No reports found.
            </div>
          ) : (
            filteredReports.map(r => (
              <div key={r.id} className="feature-card" style={{ textAlign: 'left', minHeight: 120, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <FaUser style={{ color: '#3b82f6', fontSize: 20 }} />
                  <span style={{ fontWeight: 600, color: '#be185d', fontSize: 18 }}>{r.patient_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FaRegFileAlt style={{ color: '#ec4899' }} />
                  <span style={{ color: '#374151', fontSize: 15 }}>{r.report}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6b7280' }}>
                  <span>{new Date(r.created_at).toLocaleString()}</span>
                  {r.shared_by_username && (
                    <span style={{ background: '#fbcfe8', color: '#be185d', borderRadius: 8, padding: '2px 8px', marginLeft: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <FaShareAlt style={{ fontSize: 13 }} /> Shared by: {r.shared_by_username}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </main>
      <footer className="homepage-footer">
        &copy; {new Date().getFullYear()} Heart Disease Prediction Project. All rights reserved.
      </footer>
    </div>
  );
} 