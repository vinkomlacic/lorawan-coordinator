'use strict';
const InvalidSensorStateError = require('./exceptions/InvalidSensorStateError');

module.exports = function buildCalculateNextGatewayTime({sensorDao}) {
  return async function calculateNextGatewayTime() {
    const sensor = await sensorDao.getSensorWithLatestNextGatewayTime();
    const sleepPeriodParam = sensor.getSensorConfig().find((sensorConfigParam) => {
      return sensorConfigParam.getKey() === 'SLEEP_PERIOD';
    });

    if (!sleepPeriodParam) {
      throw new InvalidSensorStateError('Sleep period not set');
    }

    const sleepPeriodSeconds = Number.parseInt(sleepPeriodParam.getValue(), 16);
    return new Date(sensor.getNextGatewayTime().getTime() + sleepPeriodSeconds * 1000);
  };
};
