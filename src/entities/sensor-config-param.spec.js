'use strict';
const ValidationError = require('./exceptions/ValidationError');
// TODO: replace with a real configuration adapter after implementing
const ConfigurationAdapter = require('../../test/fixtures/configuration/configuration-adapter');
const makeSensorConfigParam = require('./sensor-config-param')({ConfigurationAdapter});
const makeFakeSensorConfigParam =
    require('../../test/fixtures/entities/sensor-config-param')({ConfigurationAdapter});

const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('sensor-config-param', () => {
  it('should not allow invalid keys', () => {
    let sensorConfigParam = makeFakeSensorConfigParam({key: undefined});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({key: null});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({key: 14});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({key: 5.6});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({key: false});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({key: ''});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({key: 'invalid'});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);
  });

  it('should not allow invalid values', () => {
    let sensorConfigParam = makeFakeSensorConfigParam({value: undefined});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam();
    let invalidStringOfValidLength = '';
    for (let i = 0; i < ConfigurationAdapter.getByteSizeForKey(sensorConfigParam.key); i++) {
      invalidStringOfValidLength += '-.'; // append non hex chars
    }
    sensorConfigParam.value = invalidStringOfValidLength;
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({value: ''});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({value: 15});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({value: null});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);

    sensorConfigParam = makeFakeSensorConfigParam({value: 'salkjdalks.,-,đž'});
    expect(() => makeSensorConfigParam(sensorConfigParam)).throws(ValidationError);
  });

  it('should not throw any exceptions', () => {
    const fakeSensorConfigParam = makeFakeSensorConfigParam();
    const {key, value} = fakeSensorConfigParam;
    let sensorConfig;

    expect(() => sensorConfig = makeSensorConfigParam(fakeSensorConfigParam)).not.throws();

    expect(sensorConfig.getKey()).equals(key);
    expect(sensorConfig.getByteSize()).equals(ConfigurationAdapter.getByteSizeForKey(key));
    expect(sensorConfig.getFormat()).equals(ConfigurationAdapter.getFormatForKey(key));
    expect(sensorConfig.getValue()).equals(value);
  });
});