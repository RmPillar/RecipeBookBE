const {
  authorsData,
  recipesData,
  ingredientsData,
  instructionsData,
  categoriesData,
  recipesCategoriesData,
} = require('../data');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex('authors').insert(authorsData))
    .then(() => knex('recipes').insert(recipesData))
    .then(() => knex('ingredients').insert(ingredientsData))
    .then(() => knex('instructions').insert(instructionsData))
    .then(() => knex('categories').insert(categoriesData))
    .then(() => knex('recipes_categories').insert(recipesCategoriesData));
};
