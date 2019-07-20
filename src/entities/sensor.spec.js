'use strict';
const ValidationError = require('./exceptions/ValidationError');
const ConfigurationAdapter = require('../../test/fixtures/configuration/configuration-adapter');
const makeFakeSensorConfig =
    require('../../test/fixtures/entities/sensor-config')({ConfigurationAdapter});
const makeFakeSensorData = require('../../test/fixtures/entities/sensor-data');
const makeFakeSensor = require('../../test/fixtures/entities/sensor');

const makeSensorConfig = require('./sensor-config')({ConfigurationAdapter});
const makeSensorData = require('./sensor-data')();
const makeSensor = require('./sensor')({makeSensorConfig, makeSensorData});

const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('sensor', () => {
  it('should not allow setting invalid last gateway time', () => {
    let sensor = makeFakeSensor({lastGatewayTime: 'invalid'});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({lastGatewayTime: 69});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({lastGatewayTime: true});
    expect(() => makeSensor(sensor)).throws(ValidationError);
  });

  it('should not allow setting invalid next gateway time', () => {
    let sensor = makeFakeSensor({nextGatewayTime: 'invalid'});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({nextGatewayTime: 69});
    expect(() => makeSensor(sensor)).throws(ValidationError);

    sensor = makeFakeSensor({nextGatewayTime: true});
    expect(() => makeSensor(sensor)).throws(ValidationError);
  });

  it('should not allow setting next gateway time to a time before the last gateway time', () => {
    const before = new Date();
    const after = new Date(before.getTime() + 5000); // 5 seconds after before

    const sensor = makeFakeSensor({
      lastGatewayTime: after,
      nextGatewayTime: before,
    });

    expect(() => makeSensor(sensor)).throws(ValidationError);
  });

  it('should contain devId', () => {
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

  it('should not allow setting invalid node status value', () => {
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

  it('should not allow setting invalid node status value through set status method', () => {
    const sensor = makeSensor(makeFakeSensor());

    expect(() => sensor.setNodeStatus('INVALID')).throws(ValidationError);
    expect(() => sensor.setNodeStatus(null)).throws(ValidationError);
    expect(() => sensor.setNodeStatus(69)).throws(ValidationError);
    expect(() => sensor.setNodeStatus('')).throws(ValidationError);
    expect(() => sensor.setNodeStatus(false)).throws(ValidationError);
  });

  it(
      'should not allow setting an invalid gateway time through set next gateway time method',
      () => {
        const before = new Date();
        const after = new Date(before.getTime() + 5000); // 5 seconds after

        const sensor = makeSensor(makeFakeSensor({
          lastGatewayTime: before,
          nextGatewayTime: after,
        }));

        expect(() => sensor.setNextGatewayTime(before)).throws(ValidationError);
      }
  );

  it('should not throw any exceptions', () => {
    const fakeSensor = makeFakeSensor();
    const {lastGatewayTime, nextGatewayTime, devId, nodeStatus} = fakeSensor;

    let sensor;
    expect(() => sensor = makeSensor(fakeSensor)).not.throws();

    expect(sensor.getLastGatewayTime()).equals(lastGatewayTime);
    expect(sensor.getNextGatewayTime()).equals(nextGatewayTime);
    expect(sensor.getDevId()).equals(devId);
    expect(sensor.getNodeStatus()).equals(nodeStatus);

    const newNextGatewayTime = new Date();
    expect(() => sensor.setNextGatewayTime(newNextGatewayTime)).not.throws();

    expect(sensor.getLastGatewayTime()).equals(nextGatewayTime);
    expect(sensor.getNextGatewayTime()).equals(newNextGatewayTime);

    const fakeSensorConfigParam = makeFakeSensorConfig();
    expect(() => sensor.addSensorConfigParam(fakeSensorConfigParam)).not.throws();
    expect(sensor.getSensorConfig()[0].getKey()).equals(fakeSensorConfigParam.key);
    expect(sensor.getSensorConfig()[0].getValue()).equals(fakeSensorConfigParam.value);

    const updateValueLength = ConfigurationAdapter.getByteSizeForKey(fakeSensorConfigParam.key);
    let updateValue = '';
    for (let i = 0; i < updateValueLength; i++) {
      updateValue += 'AA';
    }
    expect(() => sensor.updateSensorConfigParam({
      key: fakeSensorConfigParam.key,
      value: updateValue,
    })).not.throws();
    expect(sensor.getSensorConfig()[0].getValue()).equals(updateValue);

    const fakeSensorData = makeFakeSensorData();
    expect(() => sensor.addSensorData(fakeSensorData)).not.throws();
    expect(sensor.getSensorData()[0].getByteSize()).equals(fakeSensorData.byteSize);
    expect(sensor.getSensorData()[0].getValue()).equals(fakeSensorData.value);
  });
});

