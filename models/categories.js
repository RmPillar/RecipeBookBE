const connection = require('../db/connection');

exports.fetchCategories = () => {
  return connection('categories');
};
