const {
  fetchRecipes,
  sendRecipes,
  removeRecipe,
  updateRecipe,
  fetchRecipeInstructions,
} = require('../models/recipes');

exports.getRecipes = ({ query }, res, next) => {
  const {
    sort_by = 'name',
    order = 'asc',
    p = 1,
    limit = 10,
    category = '',
    author = '',
  } = query;
  fetchRecipes(sort_by, order, p, limit, category, author)
    .then((recipes) => {
      res.status(200).send({ recipes, count: recipes.length });
    })
    .catch(next);
};

exports.postRecipes = ({ body }, res, next) => {
  sendRecipes(body)
    .then((recipe) => {
      res.status(201).send({ recipe });
    })
    .catch(next);
};

exports.deleteRecipe = ({ params }, res, next) => {
  removeRecipe(params.recipe_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};

exports.patchRecipe = ({ params, body }, res, next) => {
  updateRecipe(params.recipe_id, body)
    .then((recipe) => {
      res.status(200).send({ recipe });
    })
    .catch(next);
};

exports.getRecipeInstructions = ({ params }, res, next) => {
  fetchRecipeInstructions(params.recipe_id)
    .then((instructions) => {
      res.status(200).send({ instructions });
    })
    .catch(next);
};
