exports.up = (knex) => {
  return knex.schema.table('users', (table) => {
    table.integer('is_active').defaultTo(1);
    table.string('image_url').defaultTo('/static/default.jpg');
  });
};

exports.down = (knex) => {
  return knex.schema.table('users', (table) => {
    table.dropColumn('is_active');
    table.dropColumn('image_url');
  });
};
