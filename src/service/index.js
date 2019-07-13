const Service = ({
  models = require('../model'),
  logger = console,
}) => {
  const AppConfigService = require('./AppConfigService')(models.AppConfig, logger);
  const NodeService = require('./NodeService')(models.Node, logger);
  const TimePointService = require('./TimePointService')(models.TimePoint);
  const CoordinatorService = require('./CoordinatorService')(
      models.SensorData,
      TimePointService,
      AppConfigService,
      NodeService,
      logger
  );
  const TTNCallbacks = require('./TTNCallbacks')(CoordinatorService, logger);

  return {
    AppConfigService,
    CoordinatorService,
    NodeService,
    TTNCallbacks,
  };
};

module.exports = Service;
