'use strict';
module.exports = function makeSensorDataDbAdapter({
  bookshelf,
}) {
  const sensorDataDbAdapter = bookshelf.Model.extend({
    tableName: 'sensor-data',
  });

  return bookshelf.model('sensorDataDbAdapter', sensorDataDbAdapter);
};
