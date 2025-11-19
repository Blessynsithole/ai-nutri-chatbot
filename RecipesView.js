import React, { useState, useEffect } from 'react';

const RecipesView = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    ingredients: [''],
    instructions: ''
  });
  const [filters, setFilters] = useState({
    maxCalories: '',
    minProtein: '',
    dietary: ''
  });
  const [favorites, setFavorites] = useState(new Set());

  const getRecipeIcon = (recipeName) => {
    const name = recipeName.toLowerCase();
    if (name.includes('salad') || name.includes('greens')) return '🥗';
    if (name.includes('chicken') || name.includes('turkey')) return '🍗';
    if (name.includes('fish') || name.includes('salmon')) return '🐟';
    if (name.includes('beef') || name.includes('steak')) return '🥩';
    if (name.includes('pasta') || name.includes('noodle')) return '🍝';
    if (name.includes('rice') || name.includes('quinoa')) return '🍚';
    if (name.includes('soup') || name.includes('stew')) return '🍲';
    if (name.includes('sandwich') || name.includes('wrap')) return '🥪';
    return '🍽️';
  };

  useEffect(() => {
    // Fetch recipes from backend
    // Mock data for now
    setRecipes([
      {
        id: 1,
        name: 'Grilled Chicken Salad',
        calories: 350,
        protein: 35,
        carbs: 15,
        fat: 20,
        ingredients: ['Chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil'],
        instructions: 'Grill chicken, chop vegetables, mix with dressing.'
      },
      {
        id: 2,
        name: 'Quinoa Bowl',
        calories: 450,
        protein: 15,
        carbs: 60,
        fat: 18,
        ingredients: ['Quinoa', 'Black beans', 'Corn', 'Avocado', 'Lime'],
        instructions: 'Cook quinoa, mix with beans, corn, avocado, and lime juice.'
      },
      {
        id: 3,
        name: 'Salmon with Vegetables',
        calories: 500,
        protein: 40,
        carbs: 20,
        fat: 30,
        ingredients: ['Salmon fillet', 'Broccoli', 'Carrots', 'Olive oil', 'Lemon'],
        instructions: 'Bake salmon with vegetables, season with lemon and oil.'
      },
      {
        id: 4,
        name: 'Veggie Stir Fry',
        calories: 300,
        protein: 10,
        carbs: 45,
        fat: 12,
        ingredients: ['Tofu', 'Bell peppers', 'Broccoli', 'Soy sauce', 'Ginger'],
        instructions: 'Stir fry tofu and vegetables with soy sauce and ginger.'
      },
    ]);
  }, []);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCalories = !filters.maxCalories || recipe.calories <= parseInt(filters.maxCalories);
    const matchesProtein = !filters.minProtein || recipe.protein >= parseInt(filters.minProtein);
    const matchesDietary = !filters.dietary ||
      (filters.dietary === 'vegetarian' && !recipe.ingredients.some(ing => ing.toLowerCase().includes('chicken') || ing.toLowerCase().includes('beef') || ing.toLowerCase().includes('fish') || ing.toLowerCase().includes('salmon'))) ||
      (filters.dietary === 'vegan' && !recipe.ingredients.some(ing => ing.toLowerCase().includes('chicken') || ing.toLowerCase().includes('beef') || ing.toLowerCase().includes('fish') || ing.toLowerCase().includes('salmon') || ing.toLowerCase().includes('dairy') || ing.toLowerCase().includes('egg')));
    return matchesSearch && matchesCalories && matchesProtein && matchesDietary;
  });

  const addIngredient = () => {
    setNewRecipe({...newRecipe, ingredients: [...newRecipe.ingredients, '']});
  };

  const updateIngredient = (index, value) => {
    const updatedIngredients = [...newRecipe.ingredients];
    updatedIngredients[index] = value;
    setNewRecipe({...newRecipe, ingredients: updatedIngredients});
  };

  const removeIngredient = (index) => {
    const updatedIngredients = newRecipe.ingredients.filter((_, i) => i !== index);
    setNewRecipe({...newRecipe, ingredients: updatedIngredients});
  };

  const createRecipe = () => {
    if (!newRecipe.name || !newRecipe.calories) return;

    const recipe = {
      id: Date.now(),
      ...newRecipe,
      calories: parseInt(newRecipe.calories),
      protein: parseFloat(newRecipe.protein) || 0,
      carbs: parseFloat(newRecipe.carbs) || 0,
      fat: parseFloat(newRecipe.fat) || 0,
      ingredients: newRecipe.ingredients.filter(ing => ing.trim() !== '')
    };

    setRecipes([...recipes, recipe]);
    setNewRecipe({
      name: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      ingredients: [''],
      instructions: ''
    });
    setShowCreateModal(false);
  };

  const toggleFavorite = (recipeId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
    } else {
      newFavorites.add(recipeId);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="recipes-view">
      <div className="recipes-header">
        <h1>Recipe Library</h1>
        <button className="create-recipe-btn" onClick={() => setShowCreateModal(true)}>
          + Create Recipe
        </button>
      </div>

      <div className="search-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <input
            type="number"
            placeholder="Max calories"
            value={filters.maxCalories}
            onChange={(e) => setFilters({...filters, maxCalories: e.target.value})}
          />
          <input
            type="number"
            placeholder="Min protein (g)"
            value={filters.minProtein}
            onChange={(e) => setFilters({...filters, minProtein: e.target.value})}
          />
          <select
            value={filters.dietary}
            onChange={(e) => setFilters({...filters, dietary: e.target.value})}
          >
            <option value="">All diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="recipe-card fade-in">
            <div className="recipe-header">
              <div className="recipe-icon">{getRecipeIcon(recipe.name)}</div>
              <button
                className={`favorite-btn ${favorites.has(recipe.id) ? 'favorited' : ''}`}
                onClick={() => toggleFavorite(recipe.id)}
              >
                {favorites.has(recipe.id) ? '❤️' : '🤍'}
              </button>
            </div>
            <h3>{recipe.name}</h3>
            <div className="nutrition-info">
              <span className="calories">{recipe.calories} kcal</span>
              <span className="protein">P: {recipe.protein}g</span>
              <span className="carbs">C: {recipe.carbs}g</span>
              <span className="fat">F: {recipe.fat}g</span>
            </div>
            <div className="recipe-details">
              <h4>Ingredients:</h4>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h4>Instructions:</h4>
              <p>{recipe.instructions}</p>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Recipe</h2>
            <form onSubmit={(e) => { e.preventDefault(); createRecipe(); }}>
              <input
                type="text"
                placeholder="Recipe name"
                value={newRecipe.name}
                onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                required
              />
              <div className="nutrition-inputs">
                <input
                  type="number"
                  placeholder="Calories"
                  value={newRecipe.calories}
                  onChange={(e) => setNewRecipe({...newRecipe, calories: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={newRecipe.protein}
                  onChange={(e) => setNewRecipe({...newRecipe, protein: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Carbs (g)"
                  value={newRecipe.carbs}
                  onChange={(e) => setNewRecipe({...newRecipe, carbs: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Fat (g)"
                  value={newRecipe.fat}
                  onChange={(e) => setNewRecipe({...newRecipe, fat: e.target.value})}
                />
              </div>
              <div className="ingredients-section">
                <h4>Ingredients:</h4>
                {newRecipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="ingredient-input">
                    <input
                      type="text"
                      placeholder="Ingredient"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                    />
                    {newRecipe.ingredients.length > 1 && (
                      <button type="button" onClick={() => removeIngredient(index)}>×</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addIngredient}>+ Add Ingredient</button>
              </div>
              <textarea
                placeholder="Instructions"
                value={newRecipe.instructions}
                onChange={(e) => setNewRecipe({...newRecipe, instructions: e.target.value})}
                rows="4"
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit">Create Recipe</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipesView;
