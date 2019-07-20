'use strict';
const faker = require('faker');

module.exports = function buildMakeFakeSensorConfigParam({ConfigurationAdapter}) {
  return function makeFakeSensorConfigParam(overrides = {}) {
    const configurationKeys = ConfigurationAdapter.getConfigurationKeys();
    const key = faker.random.arrayElement(configurationKeys);

    const byteSize = ConfigurationAdapter.getByteSizeForKey(key);
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
};
