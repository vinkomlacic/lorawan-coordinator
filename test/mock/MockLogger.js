'use strict';

/**
 * Use to log to internal variable and check what's logged
 */
class MockLogger {
  constructor() {
    this.value = '';
  }

  /**
   * Appends to value
   * @param {Object} o
   */
  log(o = '') {
    if (typeof o === 'string') {
      this.value += o;
    } else {
      this.value += o.toString();
    }
    this.value += '\n';
  }

  /**
   * Resets internal variable
   */
  clear() {
    this.value = '';
  }
}

module.exports = MockLogger;
