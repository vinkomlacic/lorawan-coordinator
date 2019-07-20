'use strict';
const ValidationError = require('./exceptions/ValidationError');
const makeSensorData = require('./sensor-data')();
const makeFakeSensorData = require('../../test/fixtures/entities/sensor-data');

const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('sensor-data', () => {
  it('should not allow setting invalid byte size', () => {
    let sensorData = makeFakeSensorData({byteSize: 'invalid'});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({byteSize: null});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({byteSize: false});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({byteSize: true});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({byteSize: -1});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({byteSize: 1.5});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);
  });

  it('should not allow setting invalid value', () => {
    let sensorData = makeFakeSensorData({value: undefined});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({value: null});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({value: 15});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({value: false});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({value: true});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({value: 2.5});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({value: '1sklaj-.-.dlasjd'});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);

    sensorData = makeFakeSensorData({byteSize: 1, value: 'ABA'});
    expect(() => makeSensorData(sensorData)).throws(ValidationError);
  });

  it('should not throw any exceptions', () => {
    const fakeSensorData = makeFakeSensorData();
    const {byteSize, value} = fakeSensorData;

    let sensorData;
    expect(() => sensorData = makeSensorData(fakeSensorData)).to.not.throws();

    expect(sensorData.getByteSize()).equals(byteSize);
    expect(sensorData.getValue()).equals(value);
    expect(sensorData.isSavedToDb()).equals(false);
    sensorData.saved();
    expect(sensorData.isSavedToDb()).equals(true);
  });
});
