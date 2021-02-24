'use strict';
module.exports = function buildDaos({db}) {
  const appConfigDao = require('./app-config-dao')({db});
  return Object.freeze({
    appConfigDao,
  });
};
