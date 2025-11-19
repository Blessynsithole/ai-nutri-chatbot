import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 3) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Enhanced client-side validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await register(username, email, password, role);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/chat');
      }, 2000);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="register-header">
          <h1 className="register-title">Join AI NutriBot</h1>
          <p className="register-subtitle">Start your journey to better nutrition</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="username">Username</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
            />
            <label htmlFor="password">Password</label>
            {password && (
              <div className="password-strength">
                <div className={`strength-bar ${passwordStrength === 'weak' ? 'weak' : ''}`}></div>
                <div className={`strength-bar ${passwordStrength === 'medium' ? 'medium' : ''}`}></div>
                <div className={`strength-bar ${passwordStrength === 'strong' ? 'strong' : ''}`}></div>
                <div className="strength-text">
                  {passwordStrength === 'weak' && 'Weak'}
                  {passwordStrength === 'medium' && 'Medium'}
                  {passwordStrength === 'strong' && 'Strong'}
                </div>
              </div>
            )}
          </div>

          <div className="input-group">
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="professional">Professional</option>
            </select>
            <label htmlFor="role">Role</label>
          </div>

          <button
            type="submit"
            className="register-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="register-loading">
                <div className="spinner"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </form>

        <div className="register-links">
          <p>Already have an account?</p>
          <a href="/">Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
