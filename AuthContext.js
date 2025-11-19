import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('Client: Attempting login for email:', email);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Client: Login successful for user:', res.data.user.username);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      console.log('Client: Login failed for email:', email, 'Error:', error.response?.data?.message || 'Login failed');
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (username, email, password, role) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { username, email, password, role });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      setUser(res.data.user);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = { user, login, register, logout, updateUser, loading };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};