import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaComments, FaBook, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Desktop sidebar navigation items
  const desktopNavItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/meals', label: 'Meal View' },
    { path: '/progress', label: 'Progress View' },
    { path: '/recipes', label: 'Recipes' },
    { path: '/budget', label: 'Budget Meals' },
    { path: '/profile', label: 'Profile' },
    { path: '/chat', label: 'Chat' },
  ];

  // Mobile bottom navigation items (5 items with Chat in middle)
  const mobileNavItems = [
    { path: '/dashboard', label: 'Home', icon: <FaHome />, component: FaHome },
    { path: '/meals', label: 'Meals', icon: <FaUtensils />, component: FaUtensils },
    { path: '/chat', label: 'Chat', icon: <FaComments />, component: FaComments },
    { path: '/recipes', label: 'Recipes', icon: <FaBook />, component: FaBook },
    { path: '/progress', label: 'Progress', icon: <FaChartBar />, component: FaChartBar },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <nav className="navbar sidebar">
        <div className="navbar-brand">
          <Link to="/dashboard">NutriChat</Link>
        </div>
        <ul className="navbar-nav">
          {desktopNavItems.map((item) => (
            <li key={item.path} className={location.pathname === item.path ? 'active' : ''}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
          {user && (
            <li>
              <button onClick={logout} className="logout-btn">
                <FaSignOutAlt /> Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="navbar bottom-nav">
        <ul className="navbar-nav">
          {mobileNavItems.map((item) => (
            <li key={item.path} className={`${location.pathname === item.path ? 'active' : ''} ${item.label === 'Chat' ? 'chat-center' : ''}`}>
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
