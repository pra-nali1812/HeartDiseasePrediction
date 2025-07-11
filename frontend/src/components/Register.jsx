import React, { useState } from 'react';
import api from '../api';
import './Register.css';

export default function Register({ onRegister, onBack }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.role) {
      setError('Please select a role');
      return;
    }
    setLoading(true);
    try {
      await api.post('users/register/', {
        username: form.username,
        password: form.password,
        role: form.role,
      });
      setSuccess(true);
      setTimeout(() => {
        onRegister && onRegister();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.username?.[0] || err.response?.data?.role?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Animated background */}
      <div className="register-bg"></div>
      
      {/* Floating elements */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      <div className="register-form">
        <div className="register-header">
          <h2 className="register-title">Create Account</h2>
          <p className="register-subtitle">Join us to start predicting heart disease risk</p>
        </div>

        {success ? (
          <div className="success-message">
            Registration successful! You can now log in.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-fields">
              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="form-input"
                  required
                  disabled={loading}
                />
                <label htmlFor="username" className="input-label">Username</label>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="form-input"
                  required
                  disabled={loading}
                />
                <label htmlFor="password" className="input-label">Password</label>
              </div>

              <div className="input-group">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="form-input"
                  required
                  disabled={loading}
                />
                <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
              </div>

              <div className="input-group">
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="form-select"
                  required
                  disabled={loading}
                >
                  <option value="">Select your role</option>
                  <option value="nurse">Nurse</option>
                  <option value="doctor">Doctor</option>
                </select>
                <label htmlFor="role" className="input-label">Role</label>
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <button 
              type="button" 
              className="back-button" 
              onClick={onBack}
              disabled={loading}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 