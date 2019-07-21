'use strict';
const {makeSensorConfigParam} = require('../entities');

module.exports = function buildLoadSensorConfig({
  sensorConfigDao,
  defaultSensorConfig,
  validateSensor,
  DatabaseEntityNotFoundError,
}) {
  return async function loadSensorConfig({sensor, saveSensorConfig = false}) {
    validateSensor({sensor});
    const sensorConfigAllowedParamKeys = await sensorConfigDao.getKeys();

    for (const sensorConfigParamKey of sensorConfigAllowedParamKeys) {
      try {
        const sensorConfigParam = await sensorConfigDao.getConfigParamByKey(sensorConfigParamKey);
        if (saveSensorConfig) {
          await sensorConfigDao.save(sensor, sensorConfigParam);
          sensorConfigParam.saved();
        }
      } catch (error) {
        if (error instanceof DatabaseEntityNotFoundError) {
          const sensorConfigParam = makeSensorConfigParam({
            key: sensorConfigParamKey,
            value: defaultSensorConfig[sensorConfigParamKey].value,
          });
          if (saveSensorConfig) {
            await sensorConfigDao.save(sensor, sensorConfigParam);
            sensorConfigParam.saved();
          }
        } else {
          throw error;
        }
      }
    }
  };
};
