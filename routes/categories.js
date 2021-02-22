const categoriesRouter = require('express').Router();
const { getCategories, getCategoryById } = require('../controllers/categories');

categoriesRouter.route('/').get(getCategories);
categoriesRouter.route('/:category_id').get(getCategoryById);

module.exports = categoriesRouter;
