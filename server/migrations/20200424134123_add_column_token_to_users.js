exports.up = (knex) => {
  return knex.schema.table('users', (table) => {
    table.string('token').defaultTo(null);
  });
};

exports.down = (knex) => {
  return knex.schema.table('users', (table) => {
    table.dropColumn('token');
  });
};
