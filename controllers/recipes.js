const {
  fetchRecipes,
  sendRecipes,
  fetchRecipe,
  removeRecipe,
  updateRecipe,
} = require('../models/recipes');

exports.getRecipes = (req, res, next) => {
  fetchRecipes()
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

exports.getRecipe = ({ params }, res, next) => {
  fetchRecipe(params.recipe_id)
    .then((recipe) => {
      res.status(200).send({ recipe });
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
