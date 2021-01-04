const connection = require('../db/connection');
const { decodeToken, rejectToken } = require('../utils/auth');
const { isEmpty } = require('lodash');

exports.updateIngredient = async (ingredient_id, body, token) => {
  if (token) {
    const decodedToken = decodeToken(token);
    const ingredient = await connection('ingredients').where({
      ingredient_id,
    });

    if (isEmpty(ingredient))
      return Promise.reject({
        status: 404,
        msg: 'Ingredient Not Found',
      });

    const recipe = await connection('recipes').where({
      recipe_id: ingredient[0].recipe_id,
    });

    if (recipe[0].user_id == decodedToken.id) {
      return connection('ingredients')
        .where({ ingredient_id })
        .update(body)
        .returning('*')
        .then((ingredient) => ingredient[0]);
    }
  }
  return rejectToken();
};

exports.removeIngredient = async (ingredient_id, token) => {
  if (token) {
    if (token) {
      const decodedToken = decodeToken(token);
      const ingredient = await connection('ingredients').where({
        ingredient_id,
      });

      if (isEmpty(ingredient))
        return Promise.reject({
          status: 404,
          msg: 'Ingredient Not Found',
        });

      const recipe = await connection('recipes').where({
        recipe_id: ingredient[0].recipe_id,
      });

      if (recipe[0].user_id == decodedToken.id) {
        return connection('ingredients').where({ ingredient_id }).del();
      }
    }
  }
  return rejectToken();
};
