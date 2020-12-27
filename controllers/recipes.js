const { fetchRecipes } = require('../models/recipes');

exports.getRecipes = (req, res, next) => {
  fetchRecipes()
    .then((recipes) => {
      res.status(200).send({ recipes, count: recipes.length });
    })
    .catch(next);
};
