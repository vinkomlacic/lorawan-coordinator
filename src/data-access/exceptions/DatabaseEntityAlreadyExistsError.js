'use strict';
module.exports = class DatabaseEntityAlreadyExistsError extends Error {
  constructor(entity, message) {
    super();
    this.name = 'DatabaseEntityAlreadyExistsError';
    this.message = `${entity}: ${message ? message : 'already exists'}`;
  }
};
