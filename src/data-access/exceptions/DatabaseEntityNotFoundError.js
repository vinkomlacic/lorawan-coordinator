'use strict';
module.exports = class DatabaseEntityNotFoundError extends Error {
  constructor(entityName, message = 'not found') {
    super();
    this.name = 'DatabaseEntityNotFoundError';
    this.message = `${entityName}: ${message}`;
  }
};
