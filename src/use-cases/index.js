'use strict';
module.exports = function buildUseCases({
  dao,
  defaultSensorConfig,
  defaultAppConfig,
  DatabaseEntityNotFoundError,
}) {
  const {
    sensorDao,
    sensorConfigDao,
    sensorDataDao,
    appConfigDao,
  } = dao;

  const validateSensor = require('./validate-sensor');
  const loadSensorConfig = require('./load-sensor-config')({
    sensorConfigDao,
    defaultSensorConfig,
    validateSensor,
    DatabaseEntityNotFoundError,
  });
  const addSensor = require('./add-sensor')({
    validateSensor,
    sensorDao,
    loadSensorConfig,
  });
  const addSensorData = require('./add-sensor-data')({
    sensorDataDao,
    validateSensor,
  });
  const calculateNextGatewayTime = require('./calculate-next-gateway-time')({sensorDao});
  const loadAppConfig = require('./load-app-config')({
    appConfigDao,
    defaultAppConfig,
    DatabaseEntityNotFoundError,
  });
  const updateAppConfigParam = require('./update-app-config-param')({appConfigDao});
  const updateSensorConfigParam = require('./update-sensor-config-param')({sensorConfigDao});

  return Object.freeze({
    addSensor,
    addSensorData,
    calculateNextGatewayTime,
    loadAppConfig,
    loadSensorConfig,
    updateAppConfigParam,
    updateSensorConfigParam,
  });
};
