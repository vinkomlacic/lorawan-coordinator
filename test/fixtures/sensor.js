'use strict';
const faker = require('faker');

module.exports = function makeFakeSensor(overrides = {}) {
  const validNodeStatusValues = ['ACTIVE', 'PASSIVE'];
  const sensor = {
    lastGatewayTime: new Date(Date.now() - faker.random.number(120) * 1000),
    nextGatewayTime: new Date(Date.now() + faker.random.number(60) * 1000),
    devId: faker.lorem.words(2).concat('-'),
    nodeStatus: faker.random.arrayElement(validNodeStatusValues),
  };

  return {
    ...sensor,
    ...overrides,
  };
};
