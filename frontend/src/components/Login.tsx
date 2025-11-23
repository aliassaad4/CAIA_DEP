import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:3000/api';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation helpers
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  const passwordsMatch = () => {
    return password === confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate email format
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address (e.g., example@domain.com)');
      return;
    }

    // Validate password length
    if (!isValidPassword(password)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Validate password match for registration
    if (isRegister && !passwordsMatch()) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // Register
        const endpoint = isDoctor ? '/doctor/auth/register' : '/auth/register';
        const data = isDoctor
          ? { email, password, firstName, lastName, specialty }
          : { email, password, firstName, lastName };

        await axios.post(`${API_URL}${endpoint}`, data);

        // Auto-login after registration
        const loginEndpoint = isDoctor ? '/doctor/auth/login' : '/auth/login';
        const loginResponse = await axios.post(`${API_URL}${loginEndpoint}`, {
          email,
          password,
        });

        const userData = isDoctor
          ? { ...loginResponse.data.data.doctor, token: loginResponse.data.data.token, role: 'doctor' }
          : { ...loginResponse.data.data.patient, token: loginResponse.data.data.token, role: 'patient' };

        onLogin(userData);
      } else {
        // Login
        const endpoint = isDoctor ? '/doctor/auth/login' : '/auth/login';
        const response = await axios.post(`${API_URL}${endpoint}`, {
          email,
          password,
        });

        const userData = isDoctor
          ? { ...response.data.data.doctor, token: response.data.data.token, role: 'doctor' }
          : { ...response.data.data.patient, token: response.data.data.token, role: 'patient' };

        onLogin(userData);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🏥 CAIA Clinic</h1>
        <h2>{isRegister ? 'Create Account' : (isDoctor ? 'Doctor Login' : 'Patient Login')}</h2>

        <div className="role-toggle">
          <button
            type="button"
            className={!isDoctor ? 'active' : ''}
            onClick={() => setIsDoctor(false)}
          >
            Patient
          </button>
          <button
            type="button"
            className={isDoctor ? 'active' : ''}
            onClick={() => {
              setIsDoctor(true);
              setIsRegister(false); // Force login mode for doctors
            }}
          >
            Doctor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Enter your first name"
                />
              </div>

              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Enter your last name"
                />
              </div>

              {isDoctor && (
                <div className="form-group">
                  <label>Specialty</label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    required
                    placeholder="e.g., Internal Medicine"
                  />
                </div>
              )}
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className={email && !isValidEmail(email) ? 'invalid' : email && isValidEmail(email) ? 'valid' : ''}
            />
            {email && !isValidEmail(email) && (
              <span className="validation-hint error">Must be a valid email (e.g., example@domain.com)</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className={password && !isValidPassword(password) ? 'invalid' : password && isValidPassword(password) ? 'valid' : ''}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {password && !isValidPassword(password) && (
              <span className="validation-hint error">Password must be at least 6 characters</span>
            )}
          </div>

          {isRegister && (
            <div className="form-group">
              <label>Re-enter Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  className={confirmPassword && !passwordsMatch() ? 'invalid' : confirmPassword && passwordsMatch() ? 'valid' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {confirmPassword && !passwordsMatch() && (
                <span className="validation-hint error">Passwords do not match</span>
              )}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        {!isDoctor && (
          <div className="toggle-form">
            {isRegister ? (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsRegister(false)}>Login here</button>
              </p>
            ) : (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsRegister(true)}>Register here</button>
              </p>
            )}
          </div>
        )}

        {isDoctor && !isRegister && (
          <div className="doctor-info">
            <p className="info-text">
              <strong>Doctor Access Only</strong><br />
              Contact your administrator for credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
