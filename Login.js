import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = await login(email, password);
      if (userData.user.completedOnboarding) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="login-form">
      <h2>AI Nutritional Chatbot Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="professional">Professional</option>
        </select>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <p>New user? <a href="/register">Register here</a></p>
      <p><a href="/forgot-password">Forgot Password?</a></p>
    </div>
  );
};

export default Login;