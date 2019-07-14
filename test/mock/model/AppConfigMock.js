'use strict';
const ModelBaseMock = require('./ModelBaseMock');

/**
 * Mock object for AppConfig model
 * @see AppConfig
 */
class AppConfigMock extends ModelBaseMock {
  constructor({key, value, defaultValue}) {
    super();
    this.key = key;
    this.value = value;
    this.defaultValue = defaultValue;
  }

  /**
   * Sets the attributes
   * @param {string} key
   * @param {string} value
   * @param {string} defaultValue
   */
  set({key = this.key, value = this.value, defaultValue = this.defaultValue}) {
    this.key = key;
    this.value = value;
    this.defaultValue = defaultValue;
  }
}

module.exports = AppConfigMock;
