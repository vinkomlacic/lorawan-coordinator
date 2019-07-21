'use strict';

module.exports = function buildUpdateAppConfigParam({sensorConfigDao}) {
  return async function updateSensorConfigParam({sensor, sensorConfigParam}) {
    const configurationParam = await sensorConfigDao
        .getConfigParamByKey(sensor, sensorConfigParam.key);
    configurationParam.setValue(sensorConfigParam.value);

    await sensorConfigDao.update(configurationParam);
  };
};
