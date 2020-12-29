exports.up = function (knex) {
  return knex.schema.table('ingredients', (ingredientsTable) => {
    ingredientsTable.integer('index').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('ingredients', (table) => {
    table.dropColumn('index');
  });
};
