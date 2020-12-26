exports.up = function (knex) {
  return knex.schema.createTable('authors', (authorsTable) => {
    authorsTable.increments('author_id').primary();
    authorsTable.string('name').notNullable();
    authorsTable.string('description');
    authorsTable.integer('recipe_count').notNullable().default(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('authors');
};
