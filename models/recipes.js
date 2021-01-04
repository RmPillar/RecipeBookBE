const connection = require('../db/connection');
const { decodeToken } = require('../utils/auth');

exports.fetchRecipes = (
  sort_by,
  order,
  p,
  limit,
  category,
  public,
  user,
  token
) => {
  let decodedToken;
  if (token) {
    decodedToken = decodeToken(token);
  } else decodedToken = { id: '' };

  if (public === 'private' && user && user !== decodedToken.id) {
    return Promise.reject({
      status: 401,
      msg: 'Unauthorized Access',
    });
  } else if (public === 'private' && !user) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request!!',
    });
  }

  return connection('recipes')
    .modify((query) => {
      if (category)
        query.whereIn(
          'recipe_id',
          connection('recipes_categories')
            .select('recipe_id')
            .where('category_id', category)
        );

      if (user) query.where({ user_id: user });
      if (public === 'private') query.where('recipes.public', false);
      if (public === 'public') query.where('recipes.public', true);
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

exports.sendRecipes = async (newRecipe, token) => {
  if (token) {
    const decodedToken = decodeToken(token);

    const recipeData = {
      name: newRecipe.name,
      description: newRecipe.description,
      user_id: decodedToken.id,
      quantity: newRecipe.quantity,
      unit: newRecipe.unit,
      rating: newRecipe.rating,
      duration: newRecipe.duration,
      difficulty: newRecipe.difficulty,
      public: newRecipe.public,
    };
    const instructionsData = newRecipe.instructions;
    const ingredientsData = newRecipe.ingredients;
    const categoriesData = newRecipe.categories;

    const [recipe] = await connection('recipes')
      .insert(recipeData)
      .returning('*');

    const recipeCategories = categoriesData.map((category) => ({
      category_id: category.category_id,
      recipe_id: recipe.recipe_id,
    }));

    const recipeInstructions = instructionsData.map((instruction) => ({
      recipe_id: recipe.recipe_id,
      ...instruction,
    }));

    const recipeIngredients = ingredientsData.map((ingredient) => ({
      recipe_id: recipe.recipe_id,
      ...ingredient,
    }));

    const categories = await connection('recipes_categories')
      .insert(recipeCategories)
      .returning('*');

    const instructions = await connection('instructions')
      .insert(recipeInstructions)
      .returning('*');

    const ingredients = await connection('ingredients')
      .insert(recipeIngredients)
      .returning('*');

    return { ...recipe, categories, instructions, ingredients };
  } else {
    return Promise.reject({
      status: 401,
      msg: 'Unauthorized Access',
    });
  }
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

exports.fetchRecipeIngredients = (recipe_id) => {
  return connection('ingredients')
    .where({ recipe_id })
    .orderBy('index', 'asc')
    .then((ingredients) => {
      if (ingredients.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Recipe Not Found',
        });
      } else return ingredients;
    });
};

exports.fetchRecipeComments = (recipe_id) => {
  return connection('recipe-comments')
    .where({ recipe_id })
    .orderBy('date_posted', 'asc')
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Recipe Not Found',
        });
      } else return comments;
    });
};

exports.sendRecipeComment = async (recipe_id, body) => {
  const newComment = {
    recipe_id,
    ...body,
  };

  const [comment] = await connection('recipe-comments')
    .insert(newComment)
    .returning('*');

  await connection('recipes').where({ recipe_id }).increment('comment_count');

  return comment;
};
