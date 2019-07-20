'use strict';
module.exports = class AppConfigurationAdapter {
  static getAppConfigurationParams() {
    return {
      MAXIMUM_ALLOWED_ERROR: {value: '30'},
    };
  }

  static getKeys() {
    return Object.keys(this.getAppConfigurationParams());
  }
};
