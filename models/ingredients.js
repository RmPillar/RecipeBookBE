const connection = require('../db/connection');

exports.updateIngredient = (ingredient_id, body) => {
  return connection('ingredients')
    .where({ ingredient_id })
    .update(body)
    .returning('*')
    .then((ingredient) => {
      if (ingredient.length === 0) {
        return Promise.reject({
          status: 404,
          msg: 'Ingredient Not Found',
        });
      } else return ingredient[0];
    });
};

exports.removeIngredient = (ingredient_id) => {
  return connection('ingredients')
    .where({ ingredient_id })
    .del()
    .then((delCount) => {
      if (!delCount) {
        return Promise.reject({
          status: 404,
          msg: 'Ingredient Not Found',
        });
      }
    });
};
