'use strict';
module.exports = function makeDatabaseAdapters({
  knex,
  bookshelf,
}) {
  const bookshelfInstance = require('../database')({knex, bookshelf});

  const appConfigParamDbAdapter = require('./app-config-param-db-adapter')({
    bookshelf: bookshelfInstance,
  });
  const sensorConfigParamDbAdapter = require('./sensor-config-param-db-adapter')({
    bookshelf: bookshelfInstance,
  });
  const sensorConfigParamTypeDbAdapter = require('./sensor-config-param-type-db-adapter')({
    bookshelf: bookshelfInstance,
  });
  const sensorDataDbAdapter = require('./sensor-data-db-adapter')({
    bookshelf: bookshelfInstance,
  });
  const sensorDbAdapter = require('./sensor-db-adapter')({
    bookshelf: bookshelfInstance,
    sensorConfigParamDbAdapter,
    sensorDataDbAdapter,
  });

  return Object.freeze({
    appConfigParamDbAdapter,
    sensorConfigParamDbAdapter,
    sensorConfigParamTypeDbAdapter,
    sensorDataDbAdapter,
    sensorDbAdapter,
  });
};
