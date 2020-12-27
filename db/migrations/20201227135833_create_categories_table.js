exports.up = function (knex) {
  return knex.schema.createTable('categories', (categoriesTable) => {
    categoriesTable.increments('category_id').primary();
    categoriesTable.string('name').notNullable();
    categoriesTable.string('slug').notNullable();
    categoriesTable.integer('recipe_count').default(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('categories');
};
