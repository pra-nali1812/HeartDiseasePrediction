import React, { useState, useEffect } from 'react';
import api from '../api'; // axios instance with withCredentials: true
import './Login.css';

export default function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        console.log('CSRF cookie set');
      })
      .catch((err) => {
        console.error('Failed to set CSRF cookie:', err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const csrfToken = getCookie('csrftoken');
    if (!csrfToken) {
      setError('CSRF token not found. Try refreshing the page.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.post(
        'users/login/',
        { username, password },
        {
          headers: {
            'X-CSRFToken': csrfToken,
          },
        }
      );
      onLogin(res.data); // Successful login callback
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated background */}
      <div className="login-bg"></div>
      
      {/* Floating elements */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="form-input"
              required
              disabled={isLoading}
            />
            <label htmlFor="username" className="input-label">Username</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="form-input"
              required
              disabled={isLoading}
            />
            <label htmlFor="password" className="input-label">Password</label>
          </div>
        </div>

        <button 
          type="submit" 
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="form-links">
          <p className="form-link-text">
            Don't have an account?{' '}
            <button 
              type="button" 
              className="form-link" 
              onClick={onRegister}
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
