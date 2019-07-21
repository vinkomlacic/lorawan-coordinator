'use strict';
module.exports = class DatabaseEntityNotFoundError extends Error {
  constructor(entityName, message = null) {
    super();
    this.name = 'DatabaseEntityNotFoundError';
    this.message = `${entityName}: ${message ? message : 'not found'}`;
  }
};
