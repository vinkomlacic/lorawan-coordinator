'use strict';
module.exports = class InvalidSensorStateError extends Error {
  constructor(message) {
    super();
    this.name = 'InvalidSensorStateError';
    this.message = message;
  }
};
