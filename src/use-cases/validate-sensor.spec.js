'use strict';
const InvalidSensorStateError = require('./exceptions/InvalidSensorStateError');
const makeFakeSensor = require('../../test/fixtures/entities/sensor');
const {makeSensor} = require('../entities');
const validateSensor = require('./validate-sensor');

const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('validate-sensor', () => {
  it('should not throw anything provided sensor with all properties', () => {
    const sensor = makeSensor(makeFakeSensor());
    expect(() => validateSensor({sensor})).not.throws();
  });

  it('should throw InvalidSensorStateError if sensor does not have one or more properties', () => {
    let invalidSensor = makeFakeSensor();
    expect(() => validateSensor({sensor: invalidSensor})).throws(InvalidSensorStateError);

    invalidSensor = '';
    expect(() => validateSensor({sensor: invalidSensor})).throws(InvalidSensorStateError);

    invalidSensor = 'invalid';
    expect(() => validateSensor({sensor: invalidSensor})).throws(InvalidSensorStateError);

    invalidSensor = true;
    expect(() => validateSensor({sensor: invalidSensor})).throws(InvalidSensorStateError);

    invalidSensor = {getSensorConfig: () => null};
    expect(() => validateSensor({sensor: invalidSensor})).throws(InvalidSensorStateError);

    invalidSensor = {getLastGatewayTime: () => 32};
    expect(() => validateSensor({sensor: invalidSensor})).throws(InvalidSensorStateError);
  });
});
