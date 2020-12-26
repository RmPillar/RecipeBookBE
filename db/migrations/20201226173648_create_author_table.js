exports.up = function (knex) {
  return knex.schema.createTable('authors', (authorsTable) => {
    authorsTable.increments('author_id').primary();
    authorsTable.string('name').notNullable();
    authorsTable.string('description').notNullable();
    authorsTable.integer('recipe_count').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('authors');
};
