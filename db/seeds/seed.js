const { authorsData, recipesData, ingredientsData } = require('../data');

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => knex('authors').insert(authorsData))
    .then(() => knex('recipes').insert(recipesData))
    .then(() => knex('ingredients').insert(ingredientsData));
};
