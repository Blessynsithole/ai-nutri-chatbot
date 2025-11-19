import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const MealsContext = createContext();

export const useMeals = () => {
  const context = useContext(MealsContext);
  if (!context) {
    throw new Error('useMeals must be used within a MealsProvider');
  }
  return context;
};

export const MealsProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load meals from backend when user is available
  useEffect(() => {
    if (user) {
      loadMeals();
    } else {
      setMeals([]);
    }
  }, [user]);

  const loadMeals = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await axios.get(`http://localhost:5000/api/meals/${today}`);
      setMeals(res.data);
    } catch (error) {
      console.error('Error loading meals:', error);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const addMeal = async (meal) => {
    if (!user) return;
    try {
      const res = await axios.post('http://localhost:5000/api/meals', meal);
      setMeals(prevMeals => [...prevMeals, res.data]);
    } catch (error) {
      console.error('Error adding meal:', error);
      throw error;
    }
  };

  const deleteMeal = async (id) => {
    if (!user) return;
    try {
      await axios.delete(`http://localhost:5000/api/meals/${id}`);
      setMeals(prevMeals => prevMeals.filter(meal => meal._id !== id));
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  };

  const getMealsForDate = (date) => {
    return meals.filter(meal => meal.date === date);
  };

  const getProgressData = async (timeframe = 'week') => {
    if (!user) return [];
    try {
      const res = await axios.get(`http://localhost:5000/api/meals/progress/${timeframe}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching progress data:', error);
      return [];
    }
  };

  return (
    <MealsContext.Provider value={{
      meals,
      loading,
      addMeal,
      deleteMeal,
      getMealsForDate,
      getProgressData,
      loadMeals
    }}>
      {children}
    </MealsContext.Provider>
  );
};
