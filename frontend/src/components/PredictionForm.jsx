import React, { useState } from 'react';
import api from '../api';
import { FaHeart, FaCheckCircle, FaTimesCircle, FaUser, FaVenusMars, FaVial, FaHeartbeat, FaShareAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialForm = {
  name: '',
  age: '',
  gender: '',
  cp: '',
  trestbps: '',
  chol: '',
  fbs: '',
  restecg: '',
  thalach: '',
  exang: '',
  oldpeak: '',
  slope: '',
  ca: '',
  thal: '',
};

const fieldLabels = {
  name: 'Patient Name',
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
  name: <FaUser style={{ color: '#3b82f6' }} />,
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

export default function PredictionForm({ onResult, onShareReport }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [report, setReport] = useState('');
  const [shared, setShared] = useState(false);
  const [csvNoMatch, setCsvNoMatch] = useState(false);
  const [csvNoMatchMsg, setCsvNoMatchMsg] = useState('');
  const [closestMatch, setClosestMatch] = useState(null);
  const [distance, setDistance] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setCsvNoMatch(false);
    setCsvNoMatchMsg('');
    setClosestMatch(null);
    setDistance(null);
    setMessage('');
    const features = [
      parseInt(form.age),
      form.gender === 'M' ? 1 : 0,
      parseInt(form.cp),
      parseInt(form.trestbps),
      parseInt(form.chol),
      parseInt(form.fbs),
      parseInt(form.restecg),
      parseInt(form.thalach),
      parseInt(form.exang),
      parseFloat(form.oldpeak),
      parseInt(form.slope),
      parseInt(form.ca),
      parseInt(form.thal),
    ];
    try {
      const res = await api.post('predictor/predict/', {
        name: form.name,
        age: form.age,
        sex: form.gender,
        features,
      });
      setContext(res.data.prediction ? "may have" : "do not have");
      setPatientName(form.name);
      onResult && onResult(res.data.prediction, res.data.prediction_id, res.data.patient_id, { ...form });
      // Generate report
      const reportText = `${form.name}, you ${res.data.prediction ? "have" : "do not have"} heart disease.`;
      setReport(reportText);
      if (res.data.csv_match === false) {
        setCsvNoMatch(true);
        setCsvNoMatchMsg(res.data.message || 'No matching patient data found in CSV.');
        setClosestMatch(res.data.closest_match || null);
        setDistance(res.data.distance || null);
        setMessage(res.data.message || '');
      }
    } catch (err) {
      toast.error('Prediction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareReport = async () => {
    try {
      await api.post('predictor/share_report/', {
        patient_name: form.name,
        report,
      });
      setShared(true);
      toast.success('Report shared with doctor!');
      if (onShareReport) {
        onShareReport();
      }
    } catch (err) {
      toast.error('Failed to share report.');
    }
  };

  return (
    <div className="homepage-container" style={{ minHeight: '100vh', position: 'relative', zIndex: 2 }}>
      <div className="homepage-bg"></div>
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 0 2rem' }}>
        <div className="feature-card" style={{ maxWidth: 700, minWidth: 400, width: '100%', borderRadius: 20, zIndex: 2, boxShadow: '0 8px 32px rgba(236,72,153,0.10)' }}>
          <div style={{ textAlign: 'center', marginBottom: 18 }}>
            <FaHeart size={36} style={{ color: '#ec4899', marginBottom: 4 }} />
            <h2 className="hero-title" style={{ fontSize: 28, margin: 0 }}>Heart Disease Prediction</h2>
            <p className="hero-description" style={{ margin: '0.5rem 0 0', color: '#6b7280', fontSize: 16 }}>Fill in the details below to check your risk</p>
          </div>
          <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem 1.5rem' }}>
              {Object.keys(initialForm).map((key, idx) => (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label" style={{ fontWeight: 500, color: '#be185d', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {fieldIcons[key]} {fieldLabels[key]}
                  </label>
                  {key === 'gender' ? (
                    <select className="form-select" name="gender" value={form.gender} onChange={handleChange} required style={{ borderRadius: 8, border: '1.5px solid #ec4899', padding: '0.5rem', fontSize: 15 }}>
                      <option value="">Select</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  ) : key === 'fbs' ? (
                    <select className="form-select" name="fbs" value={form.fbs} onChange={handleChange} required style={{ borderRadius: 8, border: '1.5px solid #ec4899', padding: '0.5rem', fontSize: 15 }}>
                      <option value="">Select</option>
                      <option value="1">True</option>
                      <option value="0">False</option>
                    </select>
                  ) : key === 'exang' ? (
                    <select className="form-select" name="exang" value={form.exang} onChange={handleChange} required style={{ borderRadius: 8, border: '1.5px solid #ec4899', padding: '0.5rem', fontSize: 15 }}>
                      <option value="">Select</option>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  ) : (
                    <input
                      type={key === 'name' ? 'text' : key === 'oldpeak' ? 'number' : 'number'}
                      step={key === 'oldpeak' ? '0.1' : undefined}
                      className="form-control"
                      name={key}
                      value={form[key]}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: 8, border: '1.5px solid #ec4899', padding: '0.5rem', fontSize: 15 }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 28 }}>
              <button type="submit" className="hero-button" disabled={loading} style={{ minWidth: 160, fontWeight: 600, fontSize: 17 }}>
                {loading ? <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Predicting...</span> : <>Submit</>}
              </button>
            </div>
          </form>
          {csvNoMatch && (
            <div className="alert alert-warning text-center mt-4 animate__animated animate__fadeIn" style={{ borderRadius: 12, marginTop: 18 }}>
              <FaTimesCircle className="me-2" color="#e63946" />
              {csvNoMatchMsg}
              {closestMatch && (
                <div className="mt-2 small text-muted">
                  Closest match: <br />
                  <span style={{ color: closestMatch.target === 1 ? '#e63946' : '#43aa8b', fontWeight: 600 }}>
                    {closestMatch.target === 1 ? 'Heart Disease' : 'No Heart Disease'}
                  </span> (distance: {distance})
                  <br />
                  <span>age: {closestMatch.age}, sex: {closestMatch.sex}, cp: {closestMatch.cp}, ...</span>
                </div>
              )}
              {message && <div className="mt-2">{message}</div>}
            </div>
          )}
          {context && (
            <div className="my-4 animate__animated animate__fadeIn">
              <div className={`feature-card text-center shadow ${context === 'may have' ? 'border-danger' : 'border-success'}`} style={{ borderRadius: 16, margin: '0 auto', maxWidth: 350 }}>
                <div className="card-body">
                  {context === 'may have' ? (
                    <FaHeart size={32} color="#e63946" className="mb-2" />
                  ) : (
                    <FaCheckCircle size={32} color="#43aa8b" className="mb-2" />
                  )}
                  <h3 className="card-title mb-2" style={{ color: context === 'may have' ? '#e63946' : '#43aa8b' }}>
                    {patientName && <span>{patientName}, </span>}
                    You {context} heart disease.
                  </h3>
                </div>
              </div>
            </div>
          )}
          {report && (
            <div className="my-4 text-center animate__animated animate__fadeIn">
              <div className="h3" style={{ color: '#be185d', fontWeight: 600 }}>{report}</div>
              {!shared && (
                <button className="hero-button" onClick={handleShareReport} style={{ borderRadius: 20, marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <FaShareAlt /> Share this report to doctor
                </button>
              )}
              {shared && <div className="text-success mt-2" style={{ color: '#22c55e', fontWeight: 600, marginTop: 12 }}><FaCheckCircle className="me-2" />Report shared!</div>}
            </div>
          )}
        </div>
      </main>
      <footer className="homepage-footer">
        &copy; {new Date().getFullYear()} Heart Disease Prediction Project
      </footer>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}