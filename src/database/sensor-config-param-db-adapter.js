'use strict';
module.exports = function makeSensorConfigParamDbAdapter({
  bookshelf,
}) {
  const sensorConfigParamDbAdapter = bookshelf.Model.extend({
    tableName: 'sensor-config-params',
  });

  return bookshelf.model('sensorConfigParamDbAdapter', sensorConfigParamDbAdapter);
};
