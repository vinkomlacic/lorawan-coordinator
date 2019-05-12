
exports.up = function(knex, Promise) {
  return knex.schema
      .createTable('nodes', (table) => {
        table.increments('id');
        table.string('dev_id');
        table.enu('node_status', ['ACTIVE']);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      .then(() => knex.schema.createTable('time_points', (table) => {
        table.increments('id');
        table.integer('node_id').unsigned().references('id').inTable('nodes');
        table.dateTime('time').notNull();
        table.boolean('collision_detected');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      }))
      .then(() => knex.schema.createTable('sensor_data', (table) => {
        table.increments('id');
        table.integer('node_id').unsigned().references('id').inTable('nodes');
        table.integer('time_point_id').unsigned().references('id').inTable('time_points');
        table.enu('sensor_data_type', ['BATTERY_VOLTAGE']);
        table.text('value');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      }))
      .then(() => knex.schema.createTable('app_config', (table) => {
        table.string('key').primary();
        table.text('value');
        table.text('default_value');
      }))
      .then(() => knex.schema.alterTable('nodes', (table) => {
        table.integer('time_point_id').unsigned().after('id')
            .references('id').inTable('time_points');
        table.integer('next_time_point_id').unsigned().after('time_point_id')
            .references('id').inTable('time_points');
      }))
      .then(() => knex.schema.alterTable('time_points', (table) => {
        table.integer('sensor_data_id').unsigned().after('node_id')
            .references('id').inTable('sensor_data');
      }));
};

exports.down = function(knex, Promise) {
  return knex.schema
      .alterTable('time_points', (table) => {
        table.dropForeign('node_id');
        table.dropForeign('sensor_data_id');
      })
      .then(() => knex.schema.alterTable('nodes', (table) => {
        table.dropForeign('time_point_id');
        table.dropForeign('next_time_point_id');
      }))
      .then(() => knex.schema.alterTable('sensor_data', (table) => {
        table.dropForeign('node_id');
        table.dropForeign('time_point_id');
      }))
      .then(() => knex.schema.dropTable('sensor_data'))
      .then(() => knex.schema.dropTable('time_points'))
      .then(() => knex.schema.dropTable('nodes'))
      .then(() => knex.schema.dropTable('app_config'));
};
