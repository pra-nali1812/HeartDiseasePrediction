import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaPhone, FaMapMarkerAlt, FaUser, FaClock, FaArrowLeft } from 'react-icons/fa';
import api from '../api';
import './AppointmentForm.css';

export default function AppointmentForm({ onBack, onSuccess }) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalHistory: '',
    currentMedications: '',
    allergies: '',
    insuranceProvider: '',
    insuranceNumber: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to get a cookie by name
  function getCookie(name) {
    const cookieStr = document.cookie;
    const cookies = cookieStr.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  }

  // Load CSRF token on mount
  useEffect(() => {
    api.get('users/csrf/')
      .then(() => {
        console.log('CSRF cookie set for appointment form');
      })
      .catch((err) => {
        console.error('Failed to set CSRF cookie for appointment form:', err);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const csrfToken = getCookie('csrftoken');
    if (!csrfToken) {
      setError('CSRF token not found. Try refreshing the page.');
      setLoading(false);
      return;
    }

    // Convert camelCase field names to snake_case for backend
    const backendData = {
      full_name: form.fullName,
      email: form.email,
      phone_number: form.phoneNumber,
      address: form.address,
      date_of_birth: form.dateOfBirth,
      gender: form.gender,
      appointment_date: form.appointmentDate,
      appointment_time: form.appointmentTime,
      reason: form.reason,
      emergency_contact: form.emergencyContact,
      emergency_phone: form.emergencyPhone,
      medical_history: form.medicalHistory || '',
      current_medications: form.currentMedications || '',
      allergies: form.allergies || '',
      insurance_provider: form.insuranceProvider || '',
      insurance_number: form.insuranceNumber || ''
    };

    try {
      await api.post('appointments/create/', backendData, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess && onSuccess();
      }, 3000);
    } catch (err) {
      console.error('Appointment booking error:', err);
      if (err.response?.data?.details) {
        // Format validation errors for better display
        const errorDetails = err.response.data.details;
        const errorMessages = Object.entries(errorDetails)
          .map(([field, messages]) => `${field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${messages.join(', ')}`)
          .join('\n');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || 'Failed to book appointment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const currentDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days from now

  return (
    <div className="appointment-container">
      {/* Animated background */}
      <div className="appointment-bg"></div>
      
      {/* Floating elements */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      <div className="appointment-form">
        <div className="appointment-header">
          <button 
            type="button" 
            className="back-button-header" 
            onClick={onBack}
            disabled={loading}
          >
            <FaArrowLeft /> Back
          </button>
          <h2 className="appointment-title">Book Your Appointment</h2>
          <p className="appointment-subtitle">Schedule your heart disease risk assessment today</p>
        </div>

        {success ? (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>Appointment Booked Successfully!</h3>
            <p>We've received your appointment request. Our team will contact you shortly to confirm your appointment details.</p>
            <p className="success-note">You will receive a confirmation email with all the details.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-sections">
              {/* Personal Information Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaUser className="section-icon" />
                  Personal Information
                </h3>
                <div className="form-grid">
                  <div className="input-group">
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="form-input"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="fullName" className="input-label">Full Name</label>
                  </div>

                  <div className="input-group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className="form-input"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="email" className="input-label">Email Address</label>
                  </div>

                  <div className="input-group">
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="form-input"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="phoneNumber" className="input-label">Phone Number</label>
                  </div>

                  <div className="input-group">
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      className="form-input"
                      required
                      disabled={loading}
                      max={currentDate}
                    />
                    <label htmlFor="dateOfBirth" className="input-label">Date of Birth</label>
                  </div>

                  <div className="input-group">
                    <select
                      id="gender"
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      className="form-select"
                      required
                      disabled={loading}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <label htmlFor="gender" className="input-label">Gender</label>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaMapMarkerAlt className="section-icon" />
                  Address Information
                </h3>
                <div className="input-group full-width">
                  <textarea
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter your complete address"
                    className="form-textarea"
                    rows="3"
                    required
                    disabled={loading}
                  ></textarea>
                  <label htmlFor="address" className="input-label">Complete Address</label>
                </div>
              </div>

              {/* Appointment Details Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaCalendarAlt className="section-icon" />
                  Appointment Details
                </h3>
                <div className="form-grid">
                  <div className="input-group">
                    <input
                      type="date"
                      id="appointmentDate"
                      name="appointmentDate"
                      value={form.appointmentDate}
                      onChange={handleChange}
                      className="form-input"
                      required
                      disabled={loading}
                      min={currentDate}
                      max={maxDate}
                    />
                    <label htmlFor="appointmentDate" className="input-label">Preferred Date</label>
                  </div>

                  <div className="input-group">
                    <select
                      id="appointmentTime"
                      name="appointmentTime"
                      value={form.appointmentTime}
                      onChange={handleChange}
                      className="form-select"
                      required
                      disabled={loading}
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                    <label htmlFor="appointmentTime" className="input-label">Preferred Time</label>
                  </div>

                  <div className="input-group full-width">
                    <textarea
                      id="reason"
                      name="reason"
                      value={form.reason}
                      onChange={handleChange}
                      placeholder="Briefly describe your reason for the appointment"
                      className="form-textarea"
                      rows="3"
                      required
                      disabled={loading}
                    ></textarea>
                    <label htmlFor="reason" className="input-label">Reason for Visit</label>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaPhone className="section-icon" />
                  Emergency Contact
                </h3>
                <div className="form-grid">
                  <div className="input-group">
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={form.emergencyContact}
                      onChange={handleChange}
                      placeholder="Emergency contact name"
                      className="form-input"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="emergencyContact" className="input-label">Emergency Contact Name</label>
                  </div>

                  <div className="input-group">
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={form.emergencyPhone}
                      onChange={handleChange}
                      placeholder="Emergency contact phone"
                      className="form-input"
                      required
                      disabled={loading}
                    />
                    <label htmlFor="emergencyPhone" className="input-label">Emergency Contact Phone</label>
                  </div>
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaUser className="section-icon" />
                  Medical Information
                </h3>
                <div className="form-grid">
                  <div className="input-group full-width">
                    <textarea
                      id="medicalHistory"
                      name="medicalHistory"
                      value={form.medicalHistory}
                      onChange={handleChange}
                      placeholder="Any relevant medical history (optional)"
                      className="form-textarea"
                      rows="3"
                      disabled={loading}
                    ></textarea>
                    <label htmlFor="medicalHistory" className="input-label">Medical History</label>
                  </div>

                  <div className="input-group full-width">
                    <textarea
                      id="currentMedications"
                      name="currentMedications"
                      value={form.currentMedications}
                      onChange={handleChange}
                      placeholder="Current medications (optional)"
                      className="form-textarea"
                      rows="3"
                      disabled={loading}
                    ></textarea>
                    <label htmlFor="currentMedications" className="input-label">Current Medications</label>
                  </div>

                  <div className="input-group full-width">
                    <textarea
                      id="allergies"
                      name="allergies"
                      value={form.allergies}
                      onChange={handleChange}
                      placeholder="Any allergies (optional)"
                      className="form-textarea"
                      rows="2"
                      disabled={loading}
                    ></textarea>
                    <label htmlFor="allergies" className="input-label">Allergies</label>
                  </div>
                </div>
              </div>

              {/* Insurance Information Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaUser className="section-icon" />
                  Insurance Information (Optional)
                </h3>
                <div className="form-grid">
                  <div className="input-group">
                    <input
                      type="text"
                      id="insuranceProvider"
                      name="insuranceProvider"
                      value={form.insuranceProvider}
                      onChange={handleChange}
                      placeholder="Insurance provider name"
                      className="form-input"
                      disabled={loading}
                    />
                    <label htmlFor="insuranceProvider" className="input-label">Insurance Provider</label>
                  </div>

                  <div className="input-group">
                    <input
                      type="text"
                      id="insuranceNumber"
                      name="insuranceNumber"
                      value={form.insuranceNumber}
                      onChange={handleChange}
                      placeholder="Insurance policy number"
                      className="form-input"
                      disabled={loading}
                    />
                    <label htmlFor="insuranceNumber" className="input-label">Policy Number</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className={`submit-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Booking Appointment...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 