import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMeals } from '../contexts/MealsContext';

const MealView = () => {
  // const { user } = useAuth();
  const { meals, addMeal: contextAddMeal, deleteMeal: contextDeleteMeal, getMealsForDate } = useMeals();
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const today = new Date().toISOString().split('T')[0];
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });

  const getMealIcon = (mealName) => {
    const name = mealName.toLowerCase();
    if (name.includes('breakfast') || name.includes('morning')) return '🍳';
    if (name.includes('lunch') || name.includes('midday')) return '🍽️';
    if (name.includes('dinner') || name.includes('evening')) return '🍽️';
    if (name.includes('snack')) return '🍎';
    return '🍽️'; // default
  };

  const filteredMeals = getMealsForDate(filterDate);

  const quickAddMeal = async (mealPreset) => {
    try {
      const meal = {
        name: mealPreset.name,
        calories: mealPreset.calories,
        protein: mealPreset.protein || 0,
        carbs: mealPreset.carbs || 0,
        fat: mealPreset.fat || 0,
        date: filterDate,
      };
      await contextAddMeal(meal);
    } catch (error) {
      console.error('Error adding quick meal:', error);
    }
  };

  const addMeal = async () => {
    if (!newMeal.name || !newMeal.calories) return;
    try {
      const meal = {
        name: newMeal.name,
        calories: parseInt(newMeal.calories),
        protein: parseFloat(newMeal.protein) || 0,
        carbs: parseFloat(newMeal.carbs) || 0,
        fat: parseFloat(newMeal.fat) || 0,
        date: filterDate,
      };
      await contextAddMeal(meal);
      setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const deleteMeal = async (id) => {
    try {
      await contextDeleteMeal(id);
    } catch (error) {
      console.error('Error deleting meal:', error);
    }
  };

  const totalNutrients = filteredMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="meal-view">
      <h1>Meal Log</h1>

      <div className="date-filter">
        <label>Select Date:</label>
        <input
          type="date"
          value={filterDate}
          max={today}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <div className="add-meal-section">
        <h2>Add Meal for {filterDate}</h2>

        {/* Quick Add Presets */}
        <div className="quick-add-presets">
          <h3>Quick Add Common Meals</h3>
          <div className="preset-buttons">
            <button onClick={() => quickAddMeal({ name: 'Breakfast - Oatmeal', calories: 150, protein: 5, carbs: 27, fat: 3 })}>
              🍳 Oatmeal (150 kcal)
            </button>
            <button onClick={() => quickAddMeal({ name: 'Lunch - Grilled Chicken Salad', calories: 350, protein: 30, carbs: 20, fat: 15 })}>
              🥗 Chicken Salad (350 kcal)
            </button>
            <button onClick={() => quickAddMeal({ name: 'Dinner - Salmon with Veggies', calories: 400, protein: 35, carbs: 15, fat: 20 })}>
              🍣 Salmon Dinner (400 kcal)
            </button>
            <button onClick={() => quickAddMeal({ name: 'Snack - Apple', calories: 95, protein: 0, carbs: 25, fat: 0 })}>
              🍎 Apple (95 kcal)
            </button>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); addMeal(); }}>
          <input
            type="text"
            placeholder="Meal name"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Calories"
            value={newMeal.calories}
            onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={newMeal.protein}
            onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={newMeal.carbs}
            onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
          />
          <input
            type="number"
            placeholder="Fat (g)"
            value={newMeal.fat}
            onChange={(e) => setNewMeal({ ...newMeal, fat: e.target.value })}
          />
          <button type="submit">Add Meal</button>
        </form>
      </div>

      <div className="meal-list">
        <h2>Meals for {filterDate}</h2>
        <div className="total-nutrients">
          <p>Total: {totalNutrients.calories} kcal, Protein: {totalNutrients.protein}g, Carbs: {totalNutrients.carbs}g, Fat: {totalNutrients.fat}g</p>
        </div>
        <ul>
          {filteredMeals.map((meal, index) => (
            <li key={meal._id} className="meal-item fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="meal-icon">{getMealIcon(meal.name)}</div>
              <div className="meal-info">
                <strong>{meal.name}</strong> - {meal.calories} kcal
                <br />
                Protein: {meal.protein}g, Carbs: {meal.carbs}g, Fat: {meal.fat}g
              </div>
              <button onClick={() => deleteMeal(meal._id)} className="delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MealView;
