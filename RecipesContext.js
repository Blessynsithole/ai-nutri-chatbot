import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const RecipesContext = createContext();

export const useRecipes = () => {
  const context = useContext(RecipesContext);
  if (!context) {
    throw new Error('useRecipes must be used within a RecipesProvider');
  }
  return context;
};

export const RecipesProvider = ({ children }) => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch recipes for the user
  const fetchRecipes = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recipes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new recipe
  const addRecipe = async (recipeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      });
      const newRecipe = await response.json();
      setRecipes(prev => [newRecipe, ...prev]);
      return newRecipe;
    } catch (error) {
      console.error('Error adding recipe:', error);
      throw error;
    }
  };

  // Update a recipe
  const updateRecipe = async (id, recipeData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(recipeData)
      });
      const updatedRecipe = await response.json();
      setRecipes(prev => prev.map(recipe => recipe._id === id ? updatedRecipe : recipe));
      return updatedRecipe;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  };

  // Delete a recipe
  const deleteRecipe = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(prev => prev.filter(recipe => recipe._id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  };

  // Get a specific recipe
  const getRecipe = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecipes();
    }
  }, [user]);

  const value = {
    recipes,
    loading,
    fetchRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipe
  };

  return (
    <RecipesContext.Provider value={value}>
      {children}
    </RecipesContext.Provider>
  );
};
