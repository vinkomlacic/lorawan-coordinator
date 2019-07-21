'use strict';
const {makeSensor} = require('../entities');

module.exports = function buildAddSensor({
  validateSensor,
  sensorDao,
  loadSensorConfig,
}) {
  return async function addSensor({sensor}) {
    const newSensor = makeSensor(sensor);
    validateSensor({sensor: newSensor});
    loadSensorConfig({sensor: newSensor});
    sensorDao.save({sensor: newSensor});
  };
};
