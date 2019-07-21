'use strict';
const faker = require('faker');
const defaultSensorConfig = require('../../../src/default-sensor-configuration');

module.exports = function makeFakeSensorConfigParam(overrides = {}) {
  const key = faker.random.arrayElement(Object.keys(defaultSensorConfig));

  const byteSize = parseInt(defaultSensorConfig[key].byteSize, 10);
  const buffer = Buffer.alloc(byteSize);

  for (let i = 0; i < byteSize; i++) {
    buffer.writeUInt8(faker.random.number(255), i);
  }

  const sensorConfigParam = {
    key,
    value: buffer.toString('hex'),
  };

  return {
    ...sensorConfigParam,
    ...overrides,
  };
};
