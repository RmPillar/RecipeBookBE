const connection = require('../db/connection');

exports.fetchRecipes = (sort_by, order, p, limit, category, author) => {
  return connection('recipes')
    .modify((query) => {
      if (category)
        query.whereIn(
          'recipe_id',
          connection('recipes_categories')
            .select('recipe_id')
            .where('category_id', category)
        );
      if (author) query.where('recipes.author_id', author);
    })
    .orderBy(sort_by, order)
    .limit(limit)
    .offset(p * limit - limit)
    .then((recipes) => {
      const promises = recipes.map((recipe) => {
        return connection('categories').whereIn(
          'category_id',
          connection('recipes_categories')
            .select('category_id')
            .where('recipe_id', recipe.recipe_id)
        );
      });
      return Promise.all(promises).then((data) => {
        return recipes.map((recipe, i) => {
          return {
            ...recipe,
            categories: [...data[i]],
          };
        });
      });
    });
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

  const instructions = newRecipe.instructions;
  const ingredients = newRecipe.ingredients;

  const categories = newRecipe.categories;
  return connection('recipes')
    .insert(recipe)
    .returning('*')
    .then(([recipe]) => {
      const recipeCategories = categories.map((category) => ({
        category_id: category.category_id,
        recipe_id: recipe.recipe_id,
      }));
      return connection('recipes_categories')
        .insert(recipeCategories)
        .returning('*')
        .then((categories) => {
          return { ...recipe, categories };
        })
        .then((recipeWithCategories) => {
          const recipeInstructions = instructions.map((instruction) => ({
            recipe_id: recipe.recipe_id,
            ...instruction,
          }));
          return connection('instructions')
            .insert(recipeInstructions)
            .returning('*')
            .then((instructions) => {
              return { ...recipeWithCategories, instructions };
            })
            .then((recipeWithInstructions) => {
              const recipeIngredients = ingredients.map((ingredient) => ({
                recipe_id: recipe.recipe_id,
                ...ingredient,
              }));
              return connection('ingredients')
                .insert(recipeIngredients)
                .returning('*')
                .then((ingredients) => {
                  return { ...recipeWithInstructions, ingredients };
                });
            });
        });
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

exports.fetchRecipeInstructions = (recipe_id) => {
  return connection('instructions')
    .where({ recipe_id })
    .orderBy('index', 'asc')
    .then((instructions) => {
      if (instructions.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Recipe Not Found',
        });
      } else return instructions;
    });
};

exports.updateRecipeInstructions = (recipe_id, { body, index }) => {
  return connection('instructions')
    .where({ recipe_id, index })
    .update({ body })
    .returning('*')
    .then((instructions) => {
      if (instructions.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Recipe Not Found',
        });
      } else return instructions[0];
    });
};

exports.removeRecipeInstruction = (recipe_id, { index }) => {
  return connection('instructions')
    .where({ recipe_id, index })
    .del()
    .then((delCount) => {
      if (!delCount) {
        return Promise.reject({
          status: 404,
          msg: 'Instruction Not Found',
        });
      }
    });
};
