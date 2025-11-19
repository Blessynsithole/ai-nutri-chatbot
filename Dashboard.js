import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMeals } from '../contexts/MealsContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { meals, addMeal: contextAddMeal } = useMeals();
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 250, fat: 67 });

  useEffect(() => {
    if (user?.preferences) {
      setGoals({
        calories: user.preferences.targetCalories || 2000,
        protein: user.preferences.targetProtein || 150,
        carbs: user.preferences.targetCarbs || 250,
        fat: user.preferences.targetFat || 67
      });
    }
  }, [user]);
  const [progress, setProgress] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [showAddMealForm, setShowAddMealForm] = useState(false);

  useEffect(() => {
    calculateProgress();
  }, [meals]);

  const calculateProgress = () => {
    const todayMeals = meals.filter(meal => meal.date === new Date().toISOString().split('T')[0]);
    const total = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    setProgress(total);
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
        date: new Date().toISOString().split('T')[0],
      };
      await contextAddMeal(meal);
      setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '' });
      setShowAddMealForm(false);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  const progressPercentage = (current, goal) => Math.min((current / goal) * 100, 100);

  const CircularProgressRing = ({ label, current, goal, color }) => {
    const percentage = progressPercentage(current, goal);
    const radius = 50;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="ring-container">
        <svg width="120" height="120" className="progress-ring">
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke="#e6e6e6"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="ring-text">
          <div className="percentage">{Math.round(percentage)}%</div>
          <div className="label">{label}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="logo">NutriBot</div>
        <span className="material-icons hamburger">menu</span>
      </header>

      {/* Recent Meals Card */}
      <div className="card recent-meals-card">
        <h2>Recent Meals</h2>
        <ul>
          {meals.filter(meal => meal.date === new Date().toISOString().split('T')[0]).map(meal => (
            <li key={meal.id}>
              {meal.name} - {meal.calories} kcal, {meal.protein}g protein
            </li>
          ))}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="action-btn" onClick={() => setShowAddMealForm(true)}>Log Meal</button>
        <button className="action-btn" onClick={() => navigate('/recipes')}>View Recipes</button>
      </div>

      {/* Add Meal Form */}
      {showAddMealForm && (
        <div className="add-meal-form">
          <h3>Add New Meal</h3>
          <input
            type="text"
            placeholder="Meal Name"
            value={newMeal.name}
            onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Calories"
            value={newMeal.calories}
            onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
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
          <button onClick={addMeal}>Add Meal</button>
          <button onClick={() => setShowAddMealForm(false)}>Cancel</button>
        </div>
      )}

      {/* Progress Overview */}
      <div className="card progress-overview">
        <h2>Progress Overview</h2>
        <div className="progress-rings">
          <CircularProgressRing label="Calories" current={progress.calories} goal={goals.calories} color="#FF6B6B" />
          <CircularProgressRing label="Carbs" current={progress.carbs} goal={goals.carbs} color="#4ECDC4" />
          <CircularProgressRing label="Protein" current={progress.protein} goal={goals.protein} color="#45B7D1" />
          <CircularProgressRing label="Fat" current={progress.fat} goal={goals.fat} color="#FFA07A" />
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={() => setShowAddMealForm(true)}>
        <span className="material-icons">add</span>
      </button>
    </div>
  );
};

export default Dashboard;
