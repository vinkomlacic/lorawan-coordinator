'use strict';
const faker = require('faker');

module.exports = function makeFakeAppConfigParam(overrides = {}) {
  const key = faker.hacker.noun().toUpperCase();
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
