const connection = require('../db/connection');

exports.fetchRecipes = () => {
  return connection('recipes');
};

exports.sendRecipes = (newRecipe) => {
  const recipe = {
    name: newRecipe.name,
    description: newRecipe.description,
    author_id: newRecipe.author_id,
    quantity: newRecipe.quantity,
    unit: newRecipe.unit,
    rating: newRecipe.rating,
  };

  const categories = newRecipe.categories;
  return connection('recipes')
    .insert(recipe)
    .returning('*')
    .then(([recipe]) => {
      const recipeCategories = categories.map((category) => {
        return {
          category_id: category.category_id,
          recipe_id: recipe.recipe_id,
        };
      });
      return connection('recipes_categories')
        .insert(recipeCategories)
        .returning('*')
        .then((data) => {
          return { ...recipe, categories: data };
        });
    });
};
