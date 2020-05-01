exports.up = function (knex) {
  return knex.schema.createTable('friendship_statuses', (table) => {
    table.increments('id');
    table.string('name');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('friendship_statuses');
};
