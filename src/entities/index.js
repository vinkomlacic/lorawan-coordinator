'use strict';
const makeAppConfigParam = require('./app-config-param');
const makeSensorConfigParam = require('./sensor-config-param');
const makeSensorData = require('./sensor-data');
const makeSensor = require('./sensor')({makeSensorConfigParam, makeSensorData});

module.exports = Object.freeze({
  makeAppConfigParam,
  makeSensorConfigParam,
  makeSensorData,
  makeSensor,
});
