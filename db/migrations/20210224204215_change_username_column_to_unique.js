exports.up = function (knex) {
  return knex.schema.alterTable('users', (usersTable) => {
    usersTable.string('username').notNullable().unique().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', (usersTable) => {
    usersTable.string('username').notNullable().alter();
  });
};
