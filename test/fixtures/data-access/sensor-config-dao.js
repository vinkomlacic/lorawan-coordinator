'use strict';
const defaultSensorConfig = require('../../../src/default-sensor-configuration');
const {makeSensorConfigParam} = require('../../../src/entities');
const DatabaseEntityNotFoundError =
  require('../../../src/data-access/exceptions/DatabaseEntityNotFoundError');

// TODO: implement with mock database
module.exports = function makeSensorConfigDao({db}) {
  const configParams = [];

  return Object.freeze({
    getKeys: async () => Object.keys(defaultSensorConfig),
    getConfigParams: async () => {
      for (const configParam of Object.keys(defaultSensorConfig)) {
        const createdConfigParam = makeSensorConfigParam({
          key: configParam,
          value: defaultSensorConfig[configParam].value,
        });
        configParams.push(createdConfigParam);
      }

      return configParams;
    },
    getConfigParamByKey: async (sensor, key) => {
      if (!sensor) {
        throw new DatabaseEntityNotFoundError('SensorConfigParam');
      }

      if (Object.keys(defaultSensorConfig).includes(key)) {
        return makeSensorConfigParam({key, value: defaultSensorConfig[key].value});
      } else {
        throw new DatabaseEntityNotFoundError('SensorConfigParam');
      }
    },
    save: async (sensor, sensorConfigParam) => sensorConfigParam,
    saveOrUpdate: async (sensor, sensorConfigParam) => sensorConfigParam,
    update: async (sensor, sensorConfigParam) => sensorConfigParam,
  });
};
