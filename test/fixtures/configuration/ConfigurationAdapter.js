'use strict';
module.exports = class ConfigurationAdapter {
  static getConfigurationParams() {
    return {
      SLEEP_PERIOD: {byteSize: 2, format: 'uint16'},
      OFFSET: {byteSize: 2, format: 'uint16'},
      ABSOLUTE_TIME: {byteSize: 4, format: 'uint32'},
      BACKOFF_TIMEOUT: {byteSize: 2, format: 'uint16'},
      RETRY_LIMIT: {byteSize: 1, format: 'uint8'},
      CONTENTION_WINDOW_MAX: {byteSize: 1, format: 'uint8'},
      REQ_ACK: {byteSize: 1, format: 'uint8'},
      ADR: {byteSize: 1, format: 'uint8'},
      CHANNEL: {byteSize: 1, format: 'uint8'},
      SPREADING_FACTOR: {byteSize: 1, format: 'uint8'},
      BANDWIDTH: {byteSize: 1, format: 'uint8'},
      CODE_RATE: {byteSize: 1, format: 'uint8'},
      TX_POWER: {byteSize: 1, format: 'uint8'},
      RX_PERIOD: {byteSize: 1, format: 'uint8'},
      RESET: {byteSize: 1, format: 'uint8'},
    };
  }

  static getConfigurationKeys() {
    return Object.keys(this.getConfigurationParams());
  }

  static getByteSizeForKey(key) {
    if (this.getConfigurationParams().hasOwnProperty(key)) {
      return this.getConfigurationParams()[key].byteSize;
    }
    return null;
  }

  static getFormatForKey(key) {
    if (this.getConfigurationParams().hasOwnProperty(key)) {
      return this.getConfigurationParams()[key].format;
    }
    return null;
  }
};
