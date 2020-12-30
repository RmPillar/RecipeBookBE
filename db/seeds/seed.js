const {
  usersData,
  recipesData,
  ingredientsData,
  instructionsData,
  categoriesData,
  recipesCategoriesData,
  recipeCommentsData,
} = require('../data');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex('users').insert(usersData))
    .then(() => knex('recipes').insert(recipesData))
    .then(() => knex('ingredients').insert(ingredientsData))
    .then(() => knex('instructions').insert(instructionsData))
    .then(() => knex('categories').insert(categoriesData))
    .then(() => knex('recipes_categories').insert(recipesCategoriesData))
    .then(() => knex('recipe-comments').insert(recipeCommentsData));
};
