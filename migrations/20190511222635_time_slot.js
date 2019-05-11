
exports.up = function(knex, Promise) {
  return knex.schema.createTable('time_slot', (table) => {
    table.increments('id');
    table.integer('node_id').unsigned();
    table.timestamp('start_time').notNull();
    table.timestamp('end_time').notNull();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('node_id').references('id').inTable('node');
  }).then(() => knex.schema.alterTable('node', (table) => {
    table.foreign('last_time_slot_id').references('id').inTable('time_slot');
    table.foreign('next_time_slot_id').references('id').inTable('time_slot');
  }));
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('node', (table) => {
    table.dropForeign('last_time_slot_id');
    table.dropForeign('next_time_slot_id');
  }).then(() => knex.schema.dropTable('time_slot'));
};
