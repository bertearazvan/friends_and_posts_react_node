exports.up = function (knex) {
  return knex.schema.createTable('saved_articles', (table) => {
    table.increments('id');
    table.string('title').defaultTo(null);
    table.string('description').defaultTo(null);
    table.string('source').defaultTo(null);
    table.string('author').defaultTo(null);
    table.string('image_url').defaultTo(null);
    table.string('article_url').defaultTo(null);
    table.timestamp('published_at').defaultTo(null);
    table.integer('owner_id').unsigned().notNullable();
    table.foreign('owner_id').references('users.id');
    table.timestamp('saved_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('saved_articles');
};
