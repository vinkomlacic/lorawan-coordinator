'use strict';
module.exports = class IllegalAppConfigParamError extends Error {
  constructor(message) {
    super();
    this.name = 'IllegalAppConfigParamError';
    this.message = message;
  }
};
