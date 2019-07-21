'use strict';
const faker = require('faker');

module.exports = function makeFakeSensorData(overrides = {}) {
  const byteSize = faker.random.number(5) + 1; // [1, 6]
  const buffer = Buffer.alloc(byteSize);

  for (let i = 0; i < buffer.byteLength; i++) {
    buffer.writeUInt8(faker.random.number(255), i);
  }

  const sensorData = {
    byteSize,
    value: buffer.toString('hex'),
  };

  return {
    ...sensorData,
    ...overrides,
  };
};
