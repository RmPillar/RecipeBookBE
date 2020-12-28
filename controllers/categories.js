const { fetchCategories, sendCategory } = require('../models/categories');

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};

exports.postCategory = ({ body }, res, next) => {
  sendCategory(body)
    .then((category) => {
      res.status(201).send({ category });
    })
    .catch(next);
};
