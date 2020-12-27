const connection = require('../db/connection');

exports.fetchRecipes = () => {
  return connection('recipes');
};
