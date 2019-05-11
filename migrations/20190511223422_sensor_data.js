
exports.up = function(knex, Promise) {
  return knex.schema.createTable('sensor_data', (table) => {
    table.increments('id');
    table.enum('sensor_data_type', ['BATTERY_VOLTAGE']);
    table.text('value');
  }).then(() => knex.schema.createTable('node_sensor_data', (table) => {
    table.integer('node_id').unsigned().references('id').inTable('node');
    table.integer('sensor_data_id').unsigned().references('id').inTable('sensor_data');
    table.primary(['node_id', 'sensor_data_id']);
  }));
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('node_sensor_data')
      .then(() => knex.schema.dropTable('sensor_data'));
};
