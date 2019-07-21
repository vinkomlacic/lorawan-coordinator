'use strict';
const faker = require('faker');
const defaultAppConfig = require('../../../src/default-app-configuration');

module.exports = function makeFakeAppConfigParam(overrides = {}) {
  const key = faker.random.arrayElement(Object.keys(defaultAppConfig));
  const value = defaultAppConfig[key];

  const appConfigParam = {
    key,
    value,
  };

  return {
    ...appConfigParam,
    ...overrides,
  };
};
