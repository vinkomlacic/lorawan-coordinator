'use strict';
const {makeSensorConfigParam} = require('../entities');

module.exports = function buildLoadSensorConfig({
  sensorConfigDao,
  defaultSensorConfig,
  validateSensor,
  DatabaseEntityNotFoundError,
}) {
  return async function loadSensorConfig({sensor}) {
    validateSensor({sensor});
    const sensorConfigAllowedParamKeys = await sensorConfigDao.getKeys();

    for (const sensorConfigParamKey of sensorConfigAllowedParamKeys) {
      try {
        const sensorConfigParam = await sensorConfigDao.getConfigParamByKey(sensorConfigParamKey);
        await sensorConfigDao.save(sensor, sensorConfigParam);
      } catch (error) {
        if (error instanceof DatabaseEntityNotFoundError) {
          const sensorConfigParam = makeSensorConfigParam({
            key: sensorConfigParamKey,
            value: defaultSensorConfig[sensorConfigParamKey].value,
          });
          await sensorConfigDao.save(sensor, sensorConfigParam);
        } else {
          throw error;
        }
      }
    }
  };
};
