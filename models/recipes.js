const connection = require('../db/connection');

exports.fetchRecipes = (sort_by, order, p, limit) => {
  return connection('recipes')
    .orderBy(sort_by, order)
    .limit(limit * p);
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

exports.fetchRecipe = (recipe_id) => {
  return connection('recipes')
    .where({ recipe_id })
    .then((recipe) => {
      if (recipe.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Recipe Not Found',
        });
      } else {
        return connection('recipes_categories')
          .where({ recipe_id })
          .then((data) => {
            return { ...recipe[0], categories: data };
          });
      }
    });
};

exports.removeRecipe = (recipe_id) => {
  return connection('recipes')
    .where({ recipe_id })
    .del()
    .then((delCount) => {
      if (!delCount) {
        return Promise.reject({
          status: 404,
          msg: 'Recipe Not Found',
        });
      }
    });
};

exports.updateRecipe = (recipe_id, body) => {
  return connection('recipes')
    .where({ recipe_id })
    .update(body)
    .returning('*')
    .then((recipe) => {
      if (recipe.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Recipe Not Found',
        });
      } else return recipe[0];
    });
};
