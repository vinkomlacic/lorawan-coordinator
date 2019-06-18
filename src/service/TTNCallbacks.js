'use strict';
/**
 * Callback methods which control the workflow of TTN client.
 */
const {coordinate, activate} = require('./CoordinatorService');

const onUplink = (loggerObject, ttnClient) => async (devId, payload) => {
  if (!loggerObject) throw new Error('Invalid logger object.');

  loggerObject.log('Received uplink. Dev ID: ' + devId);
  loggerObject.log(payload);

  if (payload && process.env.DEBUG == 1) {
    loggerObject.log('AppID: ' + payload.app_id);
    loggerObject.log('Hardware serial: ' + payload.hardware_serial);
    loggerObject.log('Port: ' + payload.port);
    loggerObject.log('Counter: ' + payload.counter);
    loggerObject.log('Raw payload: ' + payload.payload_raw);
    loggerObject.log('Gateway time: ' + payload.metadata.time);
  }

  await coordinate(payload, devId, ttnClient, loggerObject);
};

const onActivation = (loggerObject, ttnClient) => async (devId, payload) => {
  if (!loggerObject) throw new Error('Invalid logger object.');

  loggerObject.log('Received activation. Dev ID: ' + devId);
  loggerObject.log(payload);

  if (payload && process.env.DEBUG == 1) {
    loggerObject.log('AppID: ' + payload.app_id);
    loggerObject.log('Gateway time: ' + payload.metadata.time);
  }

  await activate(data, devId, ttnClient, loggerObject);
};

module.exports = {
  onUplink,
  onActivation,
};
