'use strict';
/**
 * Module which contains functions used for coordinating nodes' sleep and
 * wakeup times.
 */
const {SensorData} = require('../model');
const TimePointService = require('./TimePointService')();
const AppConfigService = require('./AppConfigService')();
const NodeService = require('./NodeService');
const Payload = require('./Payload');

/**
 * Handles node activation:
 *    - creates a new node with this dev id
 *    - allocates a new time point for it to send next time
 *    - schedules downlink to send offset
 * @param {Object} data data packed from TTN
 * @param {String} devId developer id for the node
 * @param {Object} ttnClient object required for TTN communication
 * @param {Object} [logger=console] object required for logging
 */
const activate = async (data, devId, ttnClient, logger = console) => {
  logger.log('Activating ' + devId + ' ...');

  const node = await NodeService.checkIfNodeExists(devId, logger);
  const sleepPeriodSeconds = await AppConfigService.getSleepPeriodValue();
  const nextTimePoint = await TimePointService
      .createAndSaveNextAvailableTimePoint(sleepPeriodSeconds, node.get('id'));

  node.set({time_point: node.get('next_time_point')});
  node.set({next_time_point: nextTimePoint});

  await node.save();

  const gatewayTime = new Date(data.metadata.gateways[0].time).getTime();
  const nextTimePointTime = new Date(nextTimePoint.get('time')).getTime();
  const offsetSeconds = Math.floor((nextTimePointTime - gatewayTime) / 1000);

  sendOffset(ttnClient, offsetSeconds, logger);
  logger.log('Device: ' + devId + ' activated.');
};

/**
  * @param {Object} data Data received from sensor node.
  * @param {string} devId Device id.
  * @param {Object} ttnClient TTN client
  * @param {Object} logger Logger object.
  * @async
  */
const coordinate = async (data, devId, ttnClient, logger = console) => {
  let node = await NodeService.checkIfNodeExists(devId);

  const gatewayTime = new Date(data.metadata.gateways[0].time);
  const projectedWakeupTimePoint = node.related('nextTimePoint');

  if (!projectedWakeupTimePoint) {
    throw new Error('Unable to fetch next time point for node: ' + devId);
  }

  const projectedWakeupTime = new Date(projectedWakeupTimePoint.get('time'));

  const maxAllowedError = await AppConfigService.getMaximumAllowedErrorValue();
  const sleepPeriodSeconds = await AppConfigService.getSleepPeriodValue();

  let nextWakeupTimePoint = await TimePointService.createNewTimePoint(
      new Date(projectedWakeupTime.getTime() + sleepPeriodSeconds * 1000),
      node.get('id')
  );

  // Persist entities to db.
  try {
    node = await node.save();
    nextWakeupTimePoint = await nextWakeupTimePoint.save({
      node_id: node.get('id'),
    });
    node = await node.save({
      time_point_id: projectedWakeupTime.get('id'),
      next_time_point_id: nextWakeupTimePoint.get('id'),
    });
    await saveBatteryVoltage(data.payload_raw, node);
  } catch (e) {
    logger.error('Database exception.');
    logger.error(e);
  }

  let delta;
  try {
    delta = calculateDelta(
        projectedWakeupTime.getTime(),
        gatewayTime.getTime(),
        maxAllowedError
    );
    sendOffset(ttnClient, -delta, logger);
  } catch (e) {
    logger.error(e);
    activate(data, devId, ttnClient, logger);
  }

  // Debug printout
  if (process.env.DEBUG === '1') {
    logger.log('Gateway time: ' + gatewayTime.getTime());
    logger.log('Sleep period: ' + sleepPeriod);
    logger.log('Maximum allowed error: ' + maxAllowedError);
    logger.log('Last wakeup time: ' + lastWakeupTimePoint.get('time'));
    logger.log('Next wakeup time: ' + nextWakeupTimePoint.get('time'));
  }
};

const sendOffset = (ttnClient, offsetSeconds, logger = console) => {
  const payload = new Payload(Payload.getDataTypes().OFFSET);
  payload.setDataValue(offsetSeconds.toString(16));

  ttnClient.send(payload.hexString());
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
    value: batteryVoltageValue,
  }).save();
};


module.exports = {
  coordinate,
  activate,
  saveBatteryVoltage,
};
