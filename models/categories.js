const connection = require('../db/connection');

exports.fetchCategories = () => {
  return connection('categories');
};

exports.sendCategory = (newCategory) => {
  return connection('categories')
    .insert(newCategory)
    .returning('*')
    .then(([category]) => category);
};
