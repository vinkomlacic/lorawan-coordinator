'use strict';
module.exports = function buildMakeEntities({
  AppConfigurationAdapter,
  SensorConfigurationAdapter,
}) {
  return function makeEntities() {
    const makeAppConfigParam = require('./app-config-param')({AppConfigurationAdapter});
    const makeSensorConfigParam = require('./sensor-config-param')({SensorConfigurationAdapter});
    const makeSensorData = require('./sensor-data')();
    const makeSensor = require('./sensor')({makeSensorConfigParam, makeSensorData});

    return Object.freeze({
      makeAppConfigParam,
      makeSensorConfigParam,
      makeSensorData,
      makeSensor,
    });
  };
};
