'use strict';
module.exports = function buildMakeCli({dao}) {
  return function makeCli() {
    const makeAsyncCallback = require('./make-async-callback');
    const makeCallback = require('./make-callback');

    const appConfigController = require('./app-config-controller')({
      makeAsyncCallback,
      makeCallback,
      appConfigDao: dao.appConfigDao,
    });

    return Object.freeze({
      appConfigController,
    });
  };
};
