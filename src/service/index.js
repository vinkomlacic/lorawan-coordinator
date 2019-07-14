'use strict';
/**
 * Service module
 * @return {{
 * AppConfigService: {initializeAppConfiguration, printConfigurationParameters, setSleepPeriodValue,
 * setMaximumAllowedErrorValue, getMaximumAllowedErrorValue, getSleepPeriodValue},
 * NodeService: {checkIfNodeExists, listNodes, fetchNodes},
 * CoordinatorService: {coordinate, activate, saveBatteryVoltage},
 * TTNCallbacks: {onActivation, onUplink}}}
 * @constructor
 */
const Service = ({
  models = require('../model'),
  logger = console,
}) => {
  const AppConfigService = require('./AppConfigService')({
    AppConfig: models.AppConfig,
    logger,
  });
  const NodeService = require('./NodeService')(models.Node, logger);
  const TimePointService = require('./TimePointService')(models.TimePoint);
  const CoordinatorService = require('./CoordinatorService')({
    SensorData: models.SensorData,
    TimePointService,
    AppConfigService,
    NodeService,
    logger,
  });
  const TTNCallbacks = require('./TTNCallbacks')(CoordinatorService, logger);

  return {
    AppConfigService,
    CoordinatorService,
    NodeService,
    TTNCallbacks,
  };
};

module.exports = Service;
