'use strict';
const ConfigurationParameter = require('./ConfigurationParameter');

const configurationParameters = {
  MAXIMUM_ALLOWED_ERROR: new ConfigurationParameter('MAXIMUM_ALLOWED_ERROR', 2),
  SLEEP_PERIOD: new ConfigurationParameter('SLEEP_PERIOD', 30),
};

module.exports = configurationParameters;
