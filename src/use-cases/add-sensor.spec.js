'use strict';
const makeFakeSensor = require('../../test/fixtures/entities/sensor');

const validateSensor = require('./validate-sensor');
const sensorDao = require('../../test/fixtures/data-access/sensor-dao')({db: null});
const sensorConfigDao = require('../../test/fixtures/data-access/sensor-config-dao')({db: null});
const defaultSensorConfig = require('../default-sensor-configuration');
const DatabaseEntityNotFoundError =
  require('../data-access/exceptions/DatabaseEntityNotFoundError');
const loadSensorConfig = require('./load-sensor-config')({
  sensorConfigDao,
  defaultSensorConfig,
  validateSensor,
  DatabaseEntityNotFoundError,
});
const addSensor = require('./add-sensor')({
  validateSensor,
  sensorDao,
  loadSensorConfig,
});

const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

describe('add-sensor', () => {
  it('should not throw any exceptions', async () => {
    const sensor = makeFakeSensor();
    await expect(addSensor({sensor})).to.be.fulfilled;
  });
});
