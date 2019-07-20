'use strict';
module.exports = class IllegalArgumentError extends Error {
  constructor(method, message) {
    super();
    this.name = 'IllegalArgumentError';
    this.message = `${method}: ${message}`;
  }
};
