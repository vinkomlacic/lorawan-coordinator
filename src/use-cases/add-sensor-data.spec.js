'use strict';
const makeFakeSensor = require('../../test/fixtures/entities/sensor');
const makeFakeSensorData = require('../../test/fixtures/entities/sensor-data');
const {makeSensor} = require('../entities');
const sensorDataDao = require('../../test/fixtures/data-access/sensor-data-dao');
const validateSensor = require('./validate-sensor');

const addSensorData = require('./add-sensor-data')({sensorDataDao, validateSensor});

const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

describe('add-sensor-data', () => {
  it('should not throw any error', async () => {
    const sensor = makeSensor(makeFakeSensor());
    const sensorData = makeFakeSensorData();

    await expect(addSensorData({sensor, sensorData})).to.be.fulfilled;
    expect({
      byteSize: sensor.getSensorData()[0].getByteSize(),
      value: sensor.getSensorData()[0].getValue(),
    }).deep.equals(sensorData);

    for (const sensorData of sensor.getSensorData()) {
      expect(sensorData.isSavedToDb()).equals(true);
    }
  });
});
