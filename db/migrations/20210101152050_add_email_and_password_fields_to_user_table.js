exports.up = function (knex) {
  return knex.schema.table('users', (usersTable) => {
    usersTable.string('email').notNullable();
    usersTable.string('password').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (usersTable) => {
    usersTable.dropColumn('email');
    usersTable.dropColumn('password');
  });
};
