import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState({
    allergies: [],
    goals: [],
    language: 'en',
    location: 'New York',
    budget: 50,
    dietaryRestrictions: [],
    favoriteCuisines: []
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.preferences) {
      setPreferences({
        allergies: user.preferences.allergies || [],
        goals: user.preferences.goals || [],
        language: user.preferences.language || 'en',
        location: user.preferences.location || 'New York',
        budget: user.preferences.budget || 50,
        dietaryRestrictions: user.preferences.dietaryRestrictions || [],
        favoriteCuisines: user.preferences.favoriteCuisines || []
      });
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/auth/profile', { preferences });
      setError('');
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setSuccess('');
    }
  };

  const handleAllergiesChange = (e) => {
    setPreferences({ ...preferences, allergies: e.target.value.split(',').map(a => a.trim()).filter(a => a) });
  };

  const handleGoalsChange = (e) => {
    setPreferences({ ...preferences, goals: e.target.value.split(',').map(g => g.trim()).filter(g => g) });
  };

  const handleDietaryChange = (e) => {
    setPreferences({ ...preferences, dietaryRestrictions: e.target.value.split(',').map(d => d.trim()).filter(d => d) });
  };

  const handleCuisinesChange = (e) => {
    setPreferences({ ...preferences, favoriteCuisines: e.target.value.split(',').map(c => c.trim()).filter(c => c) });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <span className="avatar-icon">👤</span>
          <h2>{user?.name || 'User Profile'}</h2>
          <p className="profile-email">{user?.email}</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>🍽️ Nutrition Preferences</h3>
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="allergies">
                🚫 Allergies (comma-separated, e.g., nuts, dairy, gluten):
              </label>
              <input
                id="allergies"
                type="text"
                value={preferences.allergies.join(', ')}
                onChange={handleAllergiesChange}
                placeholder="e.g., peanuts, shellfish, dairy"
              />
            </div>

            <div className="form-group">
              <label htmlFor="dietary">
                🥗 Dietary Restrictions (comma-separated):
              </label>
              <input
                id="dietary"
                type="text"
                value={preferences.dietaryRestrictions.join(', ')}
                onChange={handleDietaryChange}
                placeholder="e.g., vegetarian, vegan, halal, kosher"
              />
            </div>

            <div className="form-group">
              <label htmlFor="goals">
                🎯 Health Goals (comma-separated):
              </label>
              <input
                id="goals"
                type="text"
                value={preferences.goals.join(', ')}
                onChange={handleGoalsChange}
                placeholder="e.g., weight_loss, muscle_gain, diabetes_management"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cuisines">
                🍜 Favorite Cuisines (comma-separated):
              </label>
              <input
                id="cuisines"
                type="text"
                value={preferences.favoriteCuisines.join(', ')}
                onChange={handleCuisinesChange}
                placeholder="e.g., Italian, Mexican, Chinese, Zimbabwean"
              />
            </div>
          </form>
        </div>

        <div className="profile-section">
          <h3>📍 Location & Budget</h3>
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="location">📍 Location:</label>
              <select
                id="location"
                value={preferences.location}
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
              >
                <option value="Zimbabwe">Zimbabwe (Midlands State University)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget">💰 Daily Meal Budget ($):</label>
              <input
                id="budget"
                type="number"
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.50"
                placeholder="50.00"
              />
            </div>
          </form>
        </div>

        <div className="profile-section">
          <h3>🌐 Language & Settings</h3>
          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="language">🗣️ Language:</label>
              <select
                id="language"
                value={preferences.language}
                onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="sn">Shona</option>
                <option value="nd">Ndebele</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </form>
        </div>

        <div className="profile-actions">
          <button type="submit" onClick={handleUpdate} className="save-btn">
            💾 Save Changes
          </button>
          <button type="button" onClick={() => navigate('/chat')} className="back-btn">
            ← Back to Chat
          </button>
        </div>

        {success && <div className="success-message">✅ {success}</div>}
        {error && <div className="error-message">❌ {error}</div>}
      </div>
    </div>
  );
};

export default Profile;