'use strict';
const makeFakeSensor = require('../../test/fixtures/entities/sensor');
const {makeSensor} = require('../entities');

const sensorDao = require('../../test/fixtures/data-access/sensor-dao')({db: null});

const InvalidSensorStateError = require('./exceptions/InvalidSensorStateError');
const calculateNextGatewayTime = require('./calculate-next-gateway-time')({sensorDao});

const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

describe('calculate-next-gateway-time', async () => {
  it('should not allow calculating time if the sensor does not have sleep period set', async () => {
    const sensor = makeSensor(makeFakeSensor());
    await sensorDao.deleteAll();
    await sensorDao.save(sensor);

    await expect(calculateNextGatewayTime()).to.be.rejectedWith(InvalidSensorStateError);
  });

  it('should calculate next gateway time properly given valid sensor', async () => {
    const now = new Date();
    const sleepPeriodSeconds = 30;

    const sensor = makeSensor(makeFakeSensor({nextGatewayTime: now}));
    sensor.addSensorConfigParam({
      key: 'SLEEP_PERIOD',
      value: sleepPeriodSeconds.toString(16),
    });

    await sensorDao.deleteAll();
    await sensorDao.save(sensor);

    const expectedNextGatewayTime = new Date(now.getTime() + sleepPeriodSeconds * 1000);
    const actualNextGatewayTime = await calculateNextGatewayTime();

    expect(actualNextGatewayTime.getTime()).equals(expectedNextGatewayTime.getTime());
  });
});

