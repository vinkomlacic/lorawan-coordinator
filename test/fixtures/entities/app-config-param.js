'use strict';
const faker = require('faker');

module.exports = function buildMakeFakeAppConfigParam({AppConfigurationAdapter}) {
  return function makeFakeAppConfigParam(overrides = {}) {
    const appConfigKeys = AppConfigurationAdapter.getKeys();

    const key = faker.random.arrayElement(appConfigKeys);
    const value = faker.random.number(1000).toString();

    const appConfigParam = {
      key,
      value,
    };

    return {
      ...appConfigParam,
      ...overrides,
    };
  };
};
