'use strict';
module.exports = class NoRowsUpdatedError extends Error {
  constructor(message = 'No rows updated') {
    super();
    this.name = 'NoRowsUpdatedError';
    this.message = `${message}`;
  }
};
