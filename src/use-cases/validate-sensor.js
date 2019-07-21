'use strict';
const InvalidSensorStateError = require('./exceptions/InvalidSensorStateError');
const {makeSensor} = require('../entities');

module.exports = function validateSensor({sensor}) {
  if (!sensor) {
    throw new InvalidSensorStateError('Sensor has a falsy value');
  }

  const blankSensor = makeSensor({devId: 'test'});
  const requiredProperties = Object.keys(blankSensor);

  for (const property of requiredProperties) {
    if (!sensor.hasOwnProperty(property)) {
      throw new InvalidSensorStateError(`Sensor does not have a required property: ${property}`);
    }
  }
};
