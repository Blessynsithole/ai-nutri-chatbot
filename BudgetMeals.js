import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const BudgetMeals = () => {
  // const { user } = useAuth();
  const [budget, setBudget] = useState(50); // Default budget in USD
  const [meals, setMeals] = useState([]);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [location, setLocation] = useState('Zimbabwe'); // Default location

  useEffect(() => {
    // Fetch budget meals from backend based on location
    // Mock data with local context and typical prices
    const locationMeals = {
      'Zimbabwe': [
        {
          id: 18,
          name: 'Sadza and Vegetables',
          cost: 1.50,
          calories: 450,
          protein: 12,
          carbs: 85,
          fat: 8,
          ingredients: ['Maize meal', 'Cabbage', 'Tomatoes', 'Onions'],
          icon: '🍛',
          description: 'Traditional Zimbabwean staple, affordable and filling - perfect for MSU students'
        },
        {
          id: 19,
          name: 'Chicken and Rice',
          cost: 3.00,
          calories: 520,
          protein: 35,
          carbs: 60,
          fat: 15,
          ingredients: ['Chicken', 'Rice', 'Vegetables', 'Spices'],
          icon: '🍗',
          description: 'Popular at MSU canteens and local takeaways, good protein source'
        },
        {
          id: 20,
          name: 'Bean Soup',
          cost: 1.20,
          calories: 320,
          protein: 18,
          carbs: 50,
          fat: 6,
          ingredients: ['Beans', 'Tomatoes', 'Onions', 'Peanut butter'],
          icon: '🍲',
          description: 'Hearty Zimbabwean bean soup, inexpensive and nutritious for students'
        },
        {
          id: 21,
          name: 'Mopane Worms',
          cost: 2.50,
          calories: 280,
          protein: 25,
          carbs: 15,
          fat: 12,
          ingredients: ['Mopane worms', 'Oil', 'Salt', 'Onions'],
          icon: '🐛',
          description: 'Traditional Zimbabwean delicacy, high in protein - available at local markets'
        },
        {
          id: 22,
          name: 'Sweet Potato and Greens',
          cost: 1.80,
          calories: 380,
          protein: 8,
          carbs: 75,
          fat: 4,
          ingredients: ['Sweet potatoes', 'Covo leaves', 'Tomatoes', 'Oil'],
          icon: '🍠',
          description: 'Local vegetable dish, very affordable and rich in vitamins for MSU students'
        },
        {
          id: 23,
          name: 'Kapenta Fish',
          cost: 2.80,
          calories: 350,
          protein: 30,
          carbs: 20,
          fat: 18,
          ingredients: ['Kapenta fish', 'Oil', 'Salt', 'Onions'],
          icon: '🐟',
          description: 'Dried fish from Lake Kariba, popular protein source in Midlands region'
        },
        {
          id: 24,
          name: 'Maize Porridge',
          cost: 1.00,
          calories: 300,
          protein: 8,
          carbs: 65,
          fat: 3,
          ingredients: ['Maize meal', 'Water', 'Salt'],
          icon: '🥣',
          description: 'Simple and cheap breakfast option, widely available at MSU hostels'
        },
        {
          id: 25,
          name: 'Banana and Peanut Butter',
          cost: 1.50,
          calories: 420,
          protein: 12,
          carbs: 55,
          fat: 18,
          ingredients: ['Bananas', 'Peanut butter', 'Bread'],
          icon: '🍌',
          description: 'Quick student snack, bananas are abundant in Midlands State area'
        }
      ]
    };

    setMeals(locationMeals[location] || locationMeals['New York']);
  }, [location]);

  const affordableMeals = meals.filter(meal => meal.cost <= budget);

  const addToSelection = (meal) => {
    if (!selectedMeals.find(m => m.id === meal.id)) {
      setSelectedMeals([...selectedMeals, meal]);
    }
  };

  const removeFromSelection = (id) => {
    setSelectedMeals(selectedMeals.filter(meal => meal.id !== id));
  };

  const totalCost = selectedMeals.reduce((sum, meal) => sum + meal.cost, 0);
  const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <div className="budget-meals">
      <div className="budget-header">
        <h1>🍽️ Local Budget Meals</h1>
        <p>Discover affordable, nutritious meals tailored to your location</p>
      </div>

      <div className="budget-controls">
        <div className="location-selector">
          <label htmlFor="location">📍 Location:</label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="Zimbabwe">Zimbabwe (Midlands State University)</option>
          </select>
        </div>

        <div className="budget-input">
          <label htmlFor="budget">💰 Daily Budget ($):</label>
          <input
            id="budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
            min="0"
            step="0.50"
          />
        </div>
      </div>

      <div className="meal-selection">
        <div className="available-meals">
          <h2>🍴 Meals within Budget ({affordableMeals.length})</h2>
          <div className="meals-grid">
            {affordableMeals.map(meal => (
              <div key={meal.id} className="meal-card">
                <div className="meal-header">
                  <span className="meal-icon">{meal.icon}</span>
                  <h3>{meal.name}</h3>
                </div>
                <p className="meal-description">{meal.description}</p>
                <div className="meal-details">
                  <div className="cost-badge">${meal.cost.toFixed(2)}</div>
                  <div className="nutrition-info">
                    <span className="calories">{meal.calories} kcal</span>
                    <span className="protein">P:{meal.protein}g</span>
                    <span className="carbs">C:{meal.carbs}g</span>
                    <span className="fat">F:{meal.fat}g</span>
                  </div>
                </div>
                <div className="ingredients-preview">
                  <strong>Key ingredients:</strong> {meal.ingredients.slice(0, 3).join(', ')}
                  {meal.ingredients.length > 3 && '...'}
                </div>
                <button
                  className="add-meal-btn"
                  onClick={() => addToSelection(meal)}
                  disabled={selectedMeals.find(m => m.id === meal.id)}
                >
                  {selectedMeals.find(m => m.id === meal.id) ? '✓ Added' : '+ Add to Plan'}
                </button>
              </div>
            ))}
          </div>
          {affordableMeals.length === 0 && (
            <div className="no-meals">
              <p>😔 No meals found within your budget.</p>
              <p>Try increasing your budget or changing location.</p>
            </div>
          )}
        </div>

        <div className="selected-meals">
          <h2>📋 Your Meal Plan ({selectedMeals.length} meals)</h2>
          <div className="plan-summary">
            <div className="summary-item">
              <span className="summary-label">Total Cost:</span>
              <span className="summary-value">${totalCost.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Calories:</span>
              <span className="summary-value">{totalCalories} kcal</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Budget Remaining:</span>
              <span className={`summary-value ${budget - totalCost < 0 ? 'over-budget' : 'under-budget'}`}>
                ${(budget - totalCost).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="selected-meals-list">
            {selectedMeals.length === 0 ? (
              <p className="empty-plan">Add some meals to get started!</p>
            ) : (
              selectedMeals.map(meal => (
                <div key={meal.id} className="selected-meal-item">
                  <div className="meal-info">
                    <span className="meal-icon">{meal.icon}</span>
                    <div>
                      <strong>{meal.name}</strong>
                      <div className="meal-meta">${meal.cost.toFixed(2)} • {meal.calories} kcal</div>
                    </div>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={() => removeFromSelection(meal.id)}
                    title="Remove from plan"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetMeals;
