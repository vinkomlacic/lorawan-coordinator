'use strict';
const faker = require('faker');

module.exports = function makeFakeSensorConfigParam(overrides = {}) {
  const key = faker.hacker.noun().toUpperCase();

  const byteSize = faker.random.number(5) + 1; // [1, 6]
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
