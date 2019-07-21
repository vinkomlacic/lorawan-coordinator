'use strict';
const {makeSensor} = require('../entities');
const makeFakeSensor = require('../../test/fixtures/entities/sensor');
const makeFakeSensorConfigParam = require('../../test/fixtures/entities/sensor-config-param');

const sensorConfigDao = require('../../test/fixtures/data-access/sensor-config-dao')({db: null});
const updateSensorConfigParam = require('./update-sensor-config-param')({sensorConfigDao});

const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

describe('update-sensor-config-param', () => {
  it('should not throw any exceptions', async () => {
    const sensor = makeSensor(makeFakeSensor());
    const sensorConfigParam = makeFakeSensorConfigParam();
    await expect(updateSensorConfigParam({sensor, sensorConfigParam})).to.be.fulfilled;
  });
});
