import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Onboarding.css';

const Onboarding = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    allergies: [],
    goals: [],
    dietaryRestrictions: [],
    activityLevel: 'moderately_active',
    location: 'Zimbabwe',
    targetCalories: '',
    targetProtein: '',
    targetCarbs: '',
    targetFat: ''
  });

  useEffect(() => {
    if (!user) navigate('/');
    if (user?.completedOnboarding) navigate('/dashboard');
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const calculateTargets = (goals, activityLevel) => {
    // Base BMR estimate (simplified, assuming average adult male/female)
    const baseCalories = 2000; // Placeholder; in real app, calculate based on age, weight, height, gender
    const baseProtein = 150; // g
    const baseCarbs = 250; // g
    const baseFat = 67; // g

    let calorieMultiplier = 1;
    let proteinMultiplier = 1;

    // Adjust for goals
    if (goals.includes('Weight Loss')) {
      calorieMultiplier = 0.8; // 20% deficit
    } else if (goals.includes('Weight Gain')) {
      calorieMultiplier = 1.2; // 20% surplus
    } else if (goals.includes('Muscle Building')) {
      calorieMultiplier = 1.1; // Slight surplus
      proteinMultiplier = 1.5; // Higher protein
    }

    // Adjust for activity level
    const activityFactors = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };
    calorieMultiplier *= activityFactors[activityLevel] || 1.55;

    return {
      targetCalories: Math.round(baseCalories * calorieMultiplier),
      targetProtein: Math.round(baseProtein * proteinMultiplier),
      targetCarbs: Math.round(baseCarbs * calorieMultiplier / 4), // Approx 4 cal/g
      targetFat: Math.round(baseFat * calorieMultiplier / 9) // Approx 9 cal/g
    };
  };

  const nextStep = () => {
    if (step === 4) {
      // Auto-calculate targets after activity level selection
      const calculated = calculateTargets(formData.goals, formData.activityLevel);
      setFormData(prev => ({ ...prev, ...calculated }));
    }
    setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/complete-onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await updateUser({ ...user, completedOnboarding: true, preferences: { ...user.preferences, ...formData } });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="onboarding-step">
            <h2>Welcome to AI Nutrition Chatbot!</h2>
            <p>Let's personalize your experience. First, tell us about any allergies you have.</p>
            <div className="form-group">
              <label>Allergies (select all that apply):</label>
              <div className="checkbox-group">
                {['Nuts', 'Dairy', 'Gluten', 'Eggs', 'Soy', 'Shellfish', 'None'].map(allergy => (
                  <label key={allergy} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.allergies.includes(allergy)}
                      onChange={(e) => handleArrayChange('allergies', allergy, e.target.checked)}
                    />
                    {allergy}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step">
            <h2>Your Goals</h2>
            <p>What are your main nutrition goals?</p>
            <div className="form-group">
              <label>Goals (select all that apply):</label>
              <div className="checkbox-group">
                {['Weight Loss', 'Weight Gain', 'Muscle Building', 'Maintain Weight', 'Improve Energy', 'Better Sleep', 'Heart Health'].map(goal => (
                  <label key={goal} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={(e) => handleArrayChange('goals', goal, e.target.checked)}
                    />
                    {goal}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="onboarding-step">
            <h2>Dietary Preferences</h2>
            <p>Do you follow any specific dietary patterns?</p>
            <div className="form-group">
              <label>Dietary Restrictions (select all that apply):</label>
              <div className="checkbox-group">
                {['Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 'Low-Carb', 'None'].map(restriction => (
                  <label key={restriction} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.dietaryRestrictions.includes(restriction)}
                      onChange={(e) => handleArrayChange('dietaryRestrictions', restriction, e.target.checked)}
                    />
                    {restriction}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="onboarding-step">
            <h2>Activity Level</h2>
            <p>How active are you on a daily basis?</p>
            <div className="form-group">
              <label>Activity Level:</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              >
                <option value="sedentary">Sedentary (little to no exercise)</option>
                <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                <option value="extremely_active">Extremely Active (very hard exercise & physical job)</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="onboarding-step">
            <h2>Nutrition Targets</h2>
            <p>Set your daily nutrition targets (optional, can be adjusted later):</p>
            <div className="form-group">
              <label>Daily Calorie Target:</label>
              <input
                type="number"
                placeholder="e.g., 2000"
                value={formData.targetCalories}
                onChange={(e) => handleInputChange('targetCalories', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Protein Target (g):</label>
              <input
                type="number"
                placeholder="e.g., 150"
                value={formData.targetProtein}
                onChange={(e) => handleInputChange('targetProtein', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Carbs Target (g):</label>
              <input
                type="number"
                placeholder="e.g., 250"
                value={formData.targetCarbs}
                onChange={(e) => handleInputChange('targetCarbs', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Fat Target (g):</label>
              <input
                type="number"
                placeholder="e.g., 67"
                value={formData.targetFat}
                onChange={(e) => handleInputChange('targetFat', e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-progress">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(step / 5) * 100}%` }}></div>
        </div>
        <div className="step-indicators">
          {[1, 2, 3, 4, 5].map(num => (
            <div key={num} className={`step-indicator ${step >= num ? 'active' : ''}`}>
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className="onboarding-content">
        {renderStep()}
      </div>

      <div className="onboarding-navigation">
        {step > 1 && <button onClick={prevStep} className="btn-secondary">Previous</button>}
        {step < 5 ? (
          <button onClick={nextStep} className="btn-primary">Next</button>
        ) : (
          <button onClick={handleSubmit} className="btn-primary">Complete Setup</button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
