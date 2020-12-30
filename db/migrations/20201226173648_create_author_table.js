exports.up = function (knex) {
  return knex.schema.createTable('users', (usersTable) => {
    usersTable.increments('user_id').primary();
    usersTable.string('name').notNullable();
    usersTable.string('description');
    usersTable.integer('recipe_count').default(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
