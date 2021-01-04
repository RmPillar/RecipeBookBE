const { updateIngredient, removeIngredient } = require('../models/ingredients');

exports.patchIngredient = ({ params, body, headers }, res, next) => {
  const token = headers['x-access-token'];

  updateIngredient(params.ingredient_id, body, token)
    .then((ingredient) => {
      res.status(200).send({ ingredient });
    })
    .catch(next);
};

exports.deleteIngredient = ({ params, headers }, res, next) => {
  const token = headers['x-access-token'];

  removeIngredient(params.ingredient_id, token)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
