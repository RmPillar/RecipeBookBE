const {
  fetchRecipes,
  sendRecipes,
  removeRecipe,
  updateRecipe,
  fetchRecipeInstructions,
  fetchRecipeIngredients,
  fetchRecipeComments,
  sendRecipeComment,
} = require('../models/recipes');

exports.getRecipes = ({ query }, res, next) => {
  const {
    sort_by = 'name',
    order = 'asc',
    p = 1,
    limit = 10,
    category = '',
    user = '',
    public = true,
  } = query;
  fetchRecipes(sort_by, order, p, limit, category, public, user)
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

exports.getRecipeIngredients = ({ params }, res, next) => {
  fetchRecipeIngredients(params.recipe_id)
    .then((ingredients) => {
      res.status(200).send({ ingredients });
    })
    .catch(next);
};

exports.getRecipeComments = ({ params }, res, next) => {
  fetchRecipeComments(params.recipe_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postRecipeComment = ({ params, body }, res, next) => {
  sendRecipeComment(params.recipe_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};
