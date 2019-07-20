'use strict';
const ValidationError = require('./exceptions/ValidationError');
// TODO: replace with a real one after implementing
const ConfigurationAdapter = require('../../test/fixtures/configuration/ConfigurationAdapter');
const makeSensorConfig = require('./sensor-config')({ConfigurationAdapter});
const makeFakeSensorConfig =
    require('../../test/fixtures/entities/sensor-config')({ConfigurationAdapter});

const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('sensor-config', () => {
  it('should not allow invalid keys', () => {
    let sensorConfig = makeFakeSensorConfig({key: undefined});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({key: null});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({key: 14});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({key: 5.6});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({key: false});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({key: ''});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({key: 'invalid'});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);
  });

  it('should not allow invalid values', () => {
    let sensorConfig = makeFakeSensorConfig({value: undefined});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig();
    let invalidStringOfValidLength = '';
    for (let i = 0; i < ConfigurationAdapter.getByteSizeForKey(sensorConfig.key); i++) {
      invalidStringOfValidLength += '-.'; // append non hex chars
    }
    sensorConfig.value = invalidStringOfValidLength;
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({value: ''});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({value: 15});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({value: null});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);

    sensorConfig = makeFakeSensorConfig({value: 'salkjdalks.,-,đž'});
    expect(() => makeSensorConfig(sensorConfig)).throws(ValidationError);
  });

  it('should not throw any exceptions', () => {
    const fakeSensorConfig = makeFakeSensorConfig();
    const {key, value} = fakeSensorConfig;
    let sensorConfig;

    expect(() => sensorConfig = makeSensorConfig(fakeSensorConfig)).not.throws();

    expect(sensorConfig.getKey()).equals(key);
    expect(sensorConfig.getByteSize()).equals(ConfigurationAdapter.getByteSizeForKey(key));
    expect(sensorConfig.getFormat()).equals(ConfigurationAdapter.getFormatForKey(key));
    expect(sensorConfig.getValue()).equals(value);
  });
});
