'use strict';
const defaultSensorConfig = require('../../../src/default-sensor-configuration');
const {makeSensorConfig} = require('../../../src/entities');

// TODO: implement with mock database
module.exports = function makeSensorConfigDao({db}) {
  const configParams = [];

  return Object.freeze({
    getKeys: async () => Object.keys(defaultSensorConfig),
    getConfigParams: async () => {
      for (const configParam of Object.keys(defaultSensorConfig)) {
        const createdConfigParam = makeSensorConfig({
          key: configParam,
          value: defaultSensorConfig[configParam].value,
        });
        configParams.push(createdConfigParam);
      }

      return configParams;
    },
    getConfigParamByKey: async (key) => {
      if (Object.keys(defaultSensorConfig).includes(key)) {
        return makeSensorConfig({key, value: defaultSensorConfig[key].value});
      } else {
        return null;
      }
    },
    save: async (sensor, sensorConfigParam) => sensorConfigParam,
    saveOrUpdate: async (sensor, sensorConfigParam) => sensorConfigParam,
    update: async (sensor, sensorConfigParam) => sensorConfigParam,
  });
};
