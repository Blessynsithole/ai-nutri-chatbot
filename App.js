import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MealsProvider } from './contexts/MealsContext';
import { RecipesProvider } from './contexts/RecipesContext';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Onboarding from './components/Onboarding';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MealView from './components/MealView';
import ProgressView from './components/ProgressView';
import RecipesView from './components/RecipesView';
import BudgetMeals from './components/BudgetMeals';
import Profile from './components/Profile';

import Chat from './components/Chat';
import NotificationSystem from './components/NotificationSystem';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <MealsProvider>
        <RecipesProvider>
          <Router>
            <div className="App">
              <NotificationSystem />
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/meals" element={<Layout><MealView /></Layout>} />
                <Route path="/progress" element={<Layout><ProgressView /></Layout>} />
                <Route path="/recipes" element={<Layout><RecipesView /></Layout>} />
                <Route path="/budget" element={<Layout><BudgetMeals /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />

                <Route path="/chat" element={<Layout><Chat /></Layout>} />
              </Routes>
            </div>
          </Router>
        </RecipesProvider>
      </MealsProvider>
    </AuthProvider>
  );
}

export default App;
