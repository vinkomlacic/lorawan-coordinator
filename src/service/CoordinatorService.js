'use strict';
/**
 * Module which contains functions used for coordinating nodes' sleep and
 * wakeup times.
 */
const {
  AppConfig,
  Node,
  TimePoint,
} = require('../model');

/**
  * @param {Object} data Data received from sensor node.
  * @param {string} devId Device id.
  * @param {Object} logger Logger object.
  * @async
  * @todo Refactor to smaller functions.
  */
const coordinate = async (data, devId, logger) => {
  // TODO: change this to real gateway time. This is from metadata.
  const gatewayTime = new Date(data.metadata.time);

  let node;
  try {
    node = await checkIfNodeExists(devId);
  } catch (e) {
    node = await createNewNode(devId);
  }

  let lastWakeupTimePoint = await node.get('time_point');

  if (!lastWakeupTimePoint) {
    lastWakeupTimePoint = await createNewTimePoint(gatewayTime);
  }

  const lastWakeupTime = new Date(lastWakeupTimePoint.get('time'));

  const maxAllowedError = await new AppConfig({key: 'MAXIMUM_ALLOWED_ERROR'})
      .fetch()
      .then((appConfigItem) => parseInt(appConfigItem.get('value')));

  const sleepPeriod = await new AppConfig({key: 'SLEEP_PERIOD'})
      .fetch()
      .then((appConfigItem) => parseInt(appConfigItem.get('value')));

  if (Math.abs(gatewayTime.getTime() - lastWakeupTime.getTime()) > maxAllowedError) {
    lastWakeupTimePoint.set({time: gatewayTime});
  }

  let nextWakeupTimePoint = await createNewTimePoint(
      new Date(lastWakeupTime.getTime() + sleepPeriod*1000),
  );

  // Persist entities to db.
  try {
    node = await node.save();
    lastWakeupTimePoint = await lastWakeupTimePoint.save({
      node_id: node.get('id'),
    });
    nextWakeupTimePoint = await nextWakeupTimePoint.save({
      node_id: node.get('id'),
    });
    node = await node.save({
      time_point_id: lastWakeupTimePoint.get('id'),
      next_time_point_id: nextWakeupTimePoint.get('id'),
    });
  } catch (e) {
    logger.log('Database exception.');
    logger.log(e);
  }

  // Debug printout
  if (process.env.DEBUG) {
    logger.log('Gateway time: ' + gatewayTime.getTime());
    logger.log('Sleep period: ' + sleepPeriod);
    logger.log('Maximum allowed error: ' + maxAllowedError);
    logger.log('Last wakeup time: ' + lastWakeupTimePoint.get('time'));
    logger.log('Next wakeup time: ' + nextWakeupTimePoint.get('time'));
  }
};

/**
 * Check if node with the specified device id exists.
 * @param {string} devId Device id.
 * @throws {Error} if the node does not exist.
 * @return {Object} node Model of the found node.
 */
const checkIfNodeExists = async (devId) => {
  const node = await new Node({dev_id: devId}).fetch({
    withRelated: ['time_point'],
  });

  if (!node) throw Error('Node does not exist.');

  return node;
};

/**
 * Insert a new node in the database.
 * @param {string} devId Device ID.
 * @async
 * @return {Bookshelf.Model} instance of newly created model.
 */
const createNewNode = async (devId) => {
  return Node.forge({
    dev_id: devId,
    node_status: 'ACTIVE',
  });
};

/**
 * @param {Date} timeValue Time value.
 */
const createNewTimePoint = async (timeValue) => {
  return TimePoint.forge({
    time: timeValue,
    collision_detected: false,
  });
};


module.exports = {
  coordinate,
};

