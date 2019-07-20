'use strict';
const faker = require('faker');

module.exports = function buildMakeFakeSensorConfig({ConfigurationAdapter}) {
  return function makeFakeSensorConfig(overrides = {}) {
    const configurationKeys = ConfigurationAdapter.getConfigurationKeys();
    const key = faker.random.arrayElement(configurationKeys);

    const byteSize = ConfigurationAdapter.getByteSizeForKey(key);
    const buffer = Buffer.alloc(byteSize);

    for (let i = 0; i < byteSize; i++) {
      buffer.writeUInt8(faker.random.number(255), i);
    }

    const sensorConfig = {
      key,
      value: buffer.toString('hex'),
    };

    return {
      ...sensorConfig,
      ...overrides,
    };
  };
};
