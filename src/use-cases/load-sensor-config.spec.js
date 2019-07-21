'use strict';
const makeFakeSensor = require('../../test/fixtures/entities/sensor');
const {makeSensor} = require('../entities');

const sensorConfigDao = require('../../test/fixtures/data-access/sensor-config-dao')({db: null});
const defaultSensorConfig = require('../default-sensor-configuration');
const validateSensor = require('./validate-sensor');
const DatabaseEntityNotFoundError =
  require('../data-access/exceptions/DatabaseEntityNotFoundError');

const loadSensorConfig = require('./load-sensor-config')({
  sensorConfigDao,
  defaultSensorConfig,
  validateSensor,
  DatabaseEntityNotFoundError,
});

const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

describe('load-sensor-config', () => {
  it('should not throw any exception given valid sensor object', async () => {
    const sensor = makeSensor(makeFakeSensor());
    await expect(loadSensorConfig({sensor})).to.be.fulfilled;
  });
});
