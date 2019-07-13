'use strict';
/**
 * Callback methods which control the workflow of TTN client.
 * @param {Object} CoordinatorService Coordinator service.
 * Note: do not use default param CoordinatorService if you don't want for it
 * to log to console.
 * @param {Object} [logger=console] logger object
 * @return {Object} exposed methods
 */
const TTNCallbacks = (
    CoordinatorService = require('./CoordinatorService')(),
    logger = console,
) => {
  const onUplink = (ttnClient) => async (devId, payload) => {
    logger.log('Received uplink. Dev ID: ' + devId);
    logger.log(payload);

    if (payload && process.env.DEBUG === '1') {
      logger.log('AppID: ' + payload.app_id);
      logger.log('Hardware serial: ' + payload.hardware_serial);
      logger.log('Port: ' + payload.port);
      logger.log('Counter: ' + payload.counter);
      logger.log('Raw payload: ' + payload.payload_raw);
      logger.log('Gateway time: ' + payload.metadata.time);
    }

    await CoordinatorService.coordinate(payload, devId, ttnClient);
  };

  const onActivation = (ttnClient) => async (devId, payload) => {
    logger.log('Received activation. Dev ID: ' + devId);
    logger.log(payload);

    if (payload && process.env.DEBUG === '1') {
      logger.log('AppID: ' + payload.app_id);
      logger.log('Gateway time: ' + payload.metadata.time);
    }

    await CoordinatorService.activate(data, devId, ttnClient);
  };

  return {
    onUplink,
    onActivation,
  };
};

module.exports = TTNCallbacks;
