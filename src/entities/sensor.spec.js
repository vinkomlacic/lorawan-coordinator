'use strict';
const ValidationError = require('./exceptions/ValidationError');
// TODO: import real make sensor config and make sensor data
const makeSensor = require('./sensor')({
  makeSensorConfig: () => null,
  makeSensorData: () => null,
});
const makeFakeSensor = require('../../test/fixtures/sensor');

const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('sensor', () => {
  it('must not allow setting invalid last gateway time', () => {
    let sensor = makeFakeSensor({lastGatewayTime: 'invalid'});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({lastGatewayTime: 69});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({lastGatewayTime: true});
    expect(() => makeSensor(sensor)).throws(ValidationError);
  });

  it('must not allow setting invalid next gateway time', () => {
    let sensor = makeFakeSensor({nextGatewayTime: 'invalid'});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({nextGatewayTime: 69});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({nextGatewayTime: true});
    expect(() => makeSensor(sensor)).throws(ValidationError);
  });

  it('must not allow setting next gateway time to a time before the last gateway time', () => {
    const before = new Date();
    const after = new Date(before.getTime() + 5000); // 5 seconds after before

    const sensor = makeFakeSensor({
      lastGatewayTime: after,
      nextGatewayTime: before,
    });

    expect(() => makeSensor(sensor)).throws(ValidationError);
  });

  it('must contain devId', () => {
    let sensor = makeFakeSensor({devId: undefined});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({devId: null});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({devId: ''});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({devId: 0});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({devId: false});
    expect(() => makeSensor(sensor)).throws(ValidationError);
  });

  it('must not allow setting invalid node status value', () => {
    let sensor = makeFakeSensor({nodeStatus: 'INVALID'});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({nodeStatus: null});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({nodeStatus: 69});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({nodeStatus: ''});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({nodeStatus: false});
    expect(() => makeSensor(sensor)).throws(ValidationError);
  });

  it('must not allow setting invalid node status value through set status method', () => {
    const sensor = makeSensor(makeFakeSensor());

    expect(() => sensor.setNodeStatus('INVALID')).throws(ValidationError);
    expect(() => sensor.setNodeStatus(null)).throws(ValidationError);
    expect(() => sensor.setNodeStatus(69)).throws(ValidationError);
    expect(() => sensor.setNodeStatus('')).throws(ValidationError);
    expect(() => sensor.setNodeStatus(false)).throws(ValidationError);
  });

  it('must not allow setting an invalid gateway time through set next gateway time method', () => {
    const before = new Date();
    const after = new Date(before.getTime() + 5000); // 5 seconds after

    const sensor = makeSensor(makeFakeSensor({
      lastGatewayTime: before,
      nextGatewayTime: after,
    }));

    expect(() => sensor.setNextGatewayTime(before)).throws(ValidationError);
  });
});

