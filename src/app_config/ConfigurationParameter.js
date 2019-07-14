'use strict';

/**
 * Represents app config configuration parameter
 */
class ConfigurationParameter {
  constructor(code, defaultValue) {
    this.code = code;
    this.displayName = code.toLowerCase().replace(/_/g, ' ');
    this.defaultValue = defaultValue;
  }
}

module.exports = ConfigurationParameter;
