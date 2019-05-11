
exports.up = function(knex, Promise) {
  return knex.schema.createTable('app_config', (table) => {
    table.increments('id');
    table.string('key').notNull();
    table.text('value');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('app_config');
};
