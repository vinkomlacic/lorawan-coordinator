'use strict';
module.exports = function makeSensorDbAdapter({
  bookshelf,
  sensorConfigParamDbAdapter,
  sensorDataDbAdapter,
}) {
  const sensorDbAdapter = bookshelf.Model.extend({
    tableName: 'sensors',
    sensorConfigParams: function() {
      return this.hasMany(sensorConfigParamDbAdapter);
    },
    sensorData: function() {
      return this.hasMany(sensorDataDbAdapter);
    },
  });

  return bookshelf.model('sensorDbAdapter', sensorDbAdapter);
};
