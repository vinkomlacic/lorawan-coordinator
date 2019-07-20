'use strict';

/**
 * Thrown on invalid parameter passed to entity.
 */
module.exports = class ValidationError extends Error {
  constructor(entity, message) {
    super();
    this.name = 'Validation error';
    this.message = `${entity}: ${message}`;
  }
};
