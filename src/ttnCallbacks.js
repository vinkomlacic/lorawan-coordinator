'use strict';
/**
 * Callback methods which control the workflow of TTN client.
 */

const onUplink = (loggerObject, bookshelf) => (devId, payload) => {
  if (!loggerObject) throw new Error('Invalid logger object.');

  loggerObject.log('Received uplink. Dev ID: ' + devId);
  loggerObject.log(payload);

  if (payload) {
    loggerObject.log('AppID: ' + payload.app_id);
    loggerObject.log('Hardware serial: ' + payload.hardware_serial);
    loggerObject.log('Port: ' + payload.port);
    loggerObject.log('Counter: ' + payload.counter);
    loggerObject.log('Raw payload: ' + payload.payload_raw);
    loggerObject.log('Gateway time: ' + payload.metadata.time);
  }
};

module.exports = {
  onUplink,
};
