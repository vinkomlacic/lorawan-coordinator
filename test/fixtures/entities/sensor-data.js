'use strict';
const faker = require('faker');

module.exports = function makeFakeSensorData(overrides = {}) {
  let byteSize = 0;
  while (byteSize === 0) {
    byteSize = faker.random.number(6);
  }

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
