import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({
    username: user?.username || '',
    email: user?.email || '',
    language: user?.preferences?.language || 'en',
    notifications: user?.preferences?.notifications || false,
    theme: user?.preferences?.theme || 'light',
    goals: {
      calories: user?.goals?.calories || 2000,
      protein: user?.goals?.protein || 150,
      carbs: user?.goals?.carbs || 250,
      fat: user?.goals?.fat || 67,
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setSettings({ ...settings, [name]: checked });
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: { ...settings[parent], [child]: type === 'number' ? parseFloat(value) : value }
      });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const saveSettings = () => {
    // Update user settings in backend
    updateUser(settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings">
      <h1>Settings</h1>

      <form onSubmit={(e) => { e.preventDefault(); saveSettings(); }}>
        <div className="form-section">
          <h2>Profile Information</h2>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={settings.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Preferences</h2>
          <div className="form-group">
            <label>Language:</label>
            <select name="language" value={settings.language} onChange={handleChange}>
              <option value="en">English</option>
              <option value="sn">Shona</option>
              <option value="nd">Ndebele</option>
            </select>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
              />
              Enable notifications
            </label>
          </div>
          <div className="form-group">
            <label>Theme:</label>
            <select name="theme" value={settings.theme} onChange={handleChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Nutritional Goals</h2>
          <div className="form-group">
            <label>Daily Calories:</label>
            <input
              type="number"
              name="goals.calories"
              value={settings.goals.calories}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Protein (g):</label>
            <input
              type="number"
              name="goals.protein"
              value={settings.goals.protein}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Carbs (g):</label>
            <input
              type="number"
              name="goals.carbs"
              value={settings.goals.carbs}
              onChange={handleChange}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Fat (g):</label>
            <input
              type="number"
              name="goals.fat"
              value={settings.goals.fat}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        <button type="submit">Save Settings</button>
      </form>
    </div>
  );
};

export default Settings;
