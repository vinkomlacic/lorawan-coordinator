'use strict';
module.exports = function makeSensorConfigParamTypeDbAdapter({bookshelf}) {
  const sensorConfigParamTypeDbAdapter = bookshelf.Model.extend({
    tableName: 'app-config-param-types',
  });

  return bookshelf.model('sensorConfigParamTypeDbAdapter', sensorConfigParamTypeDbAdapter);
};
