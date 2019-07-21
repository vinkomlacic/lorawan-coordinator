'use strict';

module.exports = function buildAddSensorData({sensorDataDao, validateSensor}) {
  return async function addSensorData({sensor, sensorData}) {
    validateSensor({sensor});

    const newSensorData = sensor.addSensorData(sensorData);

    await sensorDataDao.save(sensor, newSensorData);
    newSensorData.saved();
  };
};
