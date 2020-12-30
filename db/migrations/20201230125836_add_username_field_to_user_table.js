exports.up = function (knex) {
  return knex.schema.table('users', (usersTable) => {
    usersTable.string('username').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (usersTable) => {
    usersTable.dropColumn('username');
  });
};
