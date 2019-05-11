
exports.up = function(knex, Promise) {
  return knex.schema.createTable('node', (table) => {
    table.increments('id');
    table.string('dev_id');
    table.integer('last_time_slot_id').unsigned();
    table.integer('next_time_slot_id').unsigned();
    table.enu('node_status', ['ACTIVE']).notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('node');
};
