'use strict';
const NodeConfigParam = require('../node_config/NodeConfigParam');
/**
 * Module which contains functions used for coordinating nodes' sleep and
 * wakeup times.
 */

const CoordinatorService = ({
  SensorData = require('../model/SensorData'),
  TimePointService = require('./TimePointService')(),
  AppConfigService = require('./AppConfigService')({}),
  NodeService = require('./NodeService')(),
  logger = console,
  configuration = require('../app_config/Configuration'),
  Payload = require('./Payload'),
}) => {
  /**
   * Handles node activation:
   *    - creates a new node with this dev id
   *    - allocates a new time point for it to send next time
   *    - schedules downlink to send offset
   * @param {boolean} coordinate
   * @param {Object} data data packed from TTN
   * @param {String} devId developer id for the node
   * @param {Object} ttnClient object required for TTN communication
   * @return {function} async function
   */
  const activate = (coordinate) => async (data, devId, ttnClient) => {
    logger.log('Activating ' + devId + ' ...');

    const node = await NodeService.checkIfNodeExists(devId);
    const nextTimePoint = await TimePointService
        .createAndSaveNextAvailableTimePoint(30, node.get('id'));

    node.set({time_point_id: node.get('next_time_point_id')});
    node.set({next_time_point_id: nextTimePoint.get('id')});

    await node.save();

    if (coordinate) {
      const gatewayTime = new Date(data.metadata.gateways[0].time).getTime();
      const nextTimePointTime = new Date(nextTimePoint.get('time')).getTime();
      const offsetSeconds = Math.floor((nextTimePointTime - gatewayTime) / 1000);

      sendOffset(ttnClient, offsetSeconds, logger);
    }

    logger.log('Device: ' + devId + ' activated.');
  };

  /**
   * @param {boolean} coordinate
   * @param {Object} data Data received from sensor node.
   * @param {string} devId Device id.
   * @param {Object} ttnClient TTN client
   * @return {function} function
   * @async
   */
  const coordinate = (coordinate) => async (data, devId, ttnClient) => {
    let node = await NodeService.checkIfNodeExists(devId);

    const gatewayTime = new Date(data.metadata.gateways[0].time);
    const projectedWakeupTimePoint = node.related('nextTimePoint');

    if (!projectedWakeupTimePoint) {
      throw new Error('Unable to fetch next time point for node: ' + devId);
    }

    const projectedWakeupTime = new Date(projectedWakeupTimePoint.get('time'));

    const maxAllowedError = await AppConfigService.getAppConfigParamValueByConfigurationParam(
        configuration.MAXIMUM_ALLOWED_ERROR
    );

    let nextWakeupTimePoint = await TimePointService.createNewTimePoint(
        new Date(projectedWakeupTime.getTime() + 30 * 1000),
        node.get('id')
    );

    // Persist entities to db.
    try {
      node = await node.save();
      nextWakeupTimePoint = await nextWakeupTimePoint.save({
        node_id: node.get('id'),
      });
      node = await node.save({
        time_point_id: projectedWakeupTimePoint.get('id'),
        next_time_point_id: nextWakeupTimePoint.get('id'),
      });
      await saveBatteryVoltage(data.payload_raw, node);
    } catch (e) {
      logger.log('Database exception.');
      logger.log(e);
    }

    if (coordinate) {
      let delta;
      try {
        delta = calculateDelta(
            projectedWakeupTime.getTime(),
            gatewayTime.getTime(),
            maxAllowedError
        );
        sendOffset(ttnClient, -delta);
      } catch (e) {
        logger.log(e);
      }
    }

    // Debug printout
    if (process.env.DEBUG === '1') {
      logger.log('Gateway time: ' + gatewayTime.getTime());
      logger.log('Sleep period: ' + 30);
      logger.log('Maximum allowed error: ' + maxAllowedError);
      logger.log('Next wakeup time: ' + nextWakeupTimePoint.get('time'));
    }
  };

  const sendOffset = (ttnClient, offsetSeconds) => {
    const payload = Buffer.alloc(NodeConfigParam.OFFSET.byteSize + 1);
    payload.writeUInt8(NodeConfigParam.OFFSET.header, 0);
    payload.writeUInt16LE(offsetSeconds, 1);

    ttnClient.send(payload.toString('hex'));
    logger.log('Sent offset to device. Offset value: ' + offsetSeconds);
  };

  const calculateDelta = (
      projectedGatewayTimeMillis,
      gatewayTimeMillis,
      maximumAllowedErrorSeconds,
  ) => {
    const delta = Math.floor((gatewayTimeMillis - projectedGatewayTimeMillis) / 1000);

    if (delta > maximumAllowedErrorSeconds) {
      throw new Error('Delta is too large.');
    }

    return delta;
  };

  const saveBatteryVoltage = async (batteryVoltageValue, node) => {
    let timePointId;
    if (node.related('time_point') != null) {
      timePointId = node.related('time_point').get('id');
    }

    return new SensorData({
      node_id: node.get('id'),
      time_point_id: timePointId,
      sensor_data_type: 'BATTERY_VOLTAGE',
      value: batteryVoltageValue.toString('hex'),
    }).save();
  };

  return {
    coordinate,
    activate,
    saveBatteryVoltage,
  };
};


module.exports = CoordinatorService;
