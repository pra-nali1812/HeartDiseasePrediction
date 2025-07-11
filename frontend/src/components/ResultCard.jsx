import React from 'react';
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle, FaUser, FaVenusMars, FaVial, FaShareAlt } from 'react-icons/fa';

// Helper to format field labels
const fieldLabels = {
  patient_name: 'Patient Name',
  age: 'Age',
  gender: 'Gender',
  cp: 'Chest Pain Type (cp)',
  trestbps: 'Resting Blood Pressure (trestbps)',
  chol: 'Cholesterol (chol)',
  fbs: 'Fasting Blood Sugar > 120 mg/dl (fbs)',
  restecg: 'Resting ECG (restecg)',
  thalach: 'Max Heart Rate (thalach)',
  exang: 'Exercise Induced Angina (exang)',
  oldpeak: 'ST Depression (oldpeak)',
  slope: 'Slope of ST Segment (slope)',
  ca: 'Number of Major Vessels (ca)',
  thal: 'Thalassemia (thal)',
};

const fieldIcons = {
  patient_name: <FaUser style={{ color: '#3b82f6' }} />,
  age: <FaVial style={{ color: '#be185d' }} />,
  gender: <FaVenusMars style={{ color: '#ec4899' }} />,
  cp: <FaHeartbeat style={{ color: '#be185d' }} />,
  trestbps: <FaVial style={{ color: '#3b82f6' }} />,
  chol: <FaVial style={{ color: '#be185d' }} />,
  fbs: <FaVial style={{ color: '#ec4899' }} />,
  restecg: <FaVial style={{ color: '#3b82f6' }} />,
  thalach: <FaVial style={{ color: '#be185d' }} />,
  exang: <FaVial style={{ color: '#ec4899' }} />,
  oldpeak: <FaVial style={{ color: '#3b82f6' }} />,
  slope: <FaVial style={{ color: '#be185d' }} />,
  ca: <FaVial style={{ color: '#ec4899' }} />,
  thal: <FaVial style={{ color: '#3b82f6' }} />,
};

export default function ResultCard({ result, shared, inputs }) {
  if (result == null) return null;
  return (
    <div className="feature-card" style={{ maxWidth: 500, margin: '0 auto', padding: '2rem 1.5rem', boxShadow: '0 8px 32px rgba(236,72,153,0.10)' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        {result ? (
          <FaExclamationTriangle style={{ color: '#ef4444', fontSize: 36, marginBottom: 4 }} />
        ) : (
          <FaCheckCircle style={{ color: '#22c55e', fontSize: 36, marginBottom: 4 }} />
        )}
        <h3 style={{ fontWeight: 700, fontSize: 22, margin: 0, color: result ? '#ef4444' : '#22c55e' }}>
          {result ? 'High risk of heart disease' : 'Low risk of heart disease'}
        </h3>
      </div>
      {inputs && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem', marginBottom: 18 }}>
          {Object.entries(inputs).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#374151' }}>
              {fieldIcons[key] || null}
              <span style={{ fontWeight: 500 }}>{fieldLabels[key] || key}:</span>
              <span style={{ color: '#be185d', fontWeight: 600, marginLeft: 4 }}>{String(value)}</span>
            </div>
          ))}
        </div>
      )}
      {shared !== undefined && (
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 15 }}>
          <FaShareAlt style={{ color: shared ? '#22c55e' : '#ec4899', marginRight: 6 }} />
          <span style={{ color: shared ? '#22c55e' : '#ec4899', fontWeight: 600 }}>
            {shared ? 'Report shared with doctor' : 'Report not shared'}
          </span>
        </div>
      )}
    </div>
  );
}
