'use strict';
const faker = require('faker');

module.exports = function buildMakeFakeSensor({makeFakeSensorConfig, makeFakeSensorData}) {
  return function makeFakeSensor(overrides = {}) {
    const validNodeStatusValues = ['ACTIVE', 'PASSIVE'];

    const sensorDataCount = faker.random.number(5);
    const sensorData = [];
    for (let i = 0; i < sensorDataCount; i++) {
      sensorData.push(makeFakeSensorData());
    }

    const sensor = {
      lastGatewayTime: new Date(Date.now() - faker.random.number(120) * 1000),
      nextGatewayTime: new Date(Date.now() + faker.random.number(60) * 1000),
      devId: `${faker.hacker.adjective()}-${faker.hacker.noun()}`,
      nodeStatus: faker.random.arrayElement(validNodeStatusValues),
      sensorData,
      sensorConfig: makeFakeSensorConfig(),
    };

    return {
      ...sensor,
      ...overrides,
    };
  };
};
