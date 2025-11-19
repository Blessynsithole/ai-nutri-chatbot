import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
