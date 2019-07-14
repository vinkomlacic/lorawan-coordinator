'use strict';
const NotFoundError = require('./NotFoundError');
/**
 * Model base
 */
class ModelBaseMock {
  /**
   * Thrown when model is unavailable
   * @return {{message: string}}
   */
  static get NotFoundError() {
    return NotFoundError;
  }

  /**
   * Get the current value of an attribute on a model
   * @param {*} attributeKey
   * @return {*} value of an attribute
   */
  get(attributeKey) {
    return this[attributeKey];
  }

  /**
   * Returns the instance
   * @param {boolean} [require=false] if true an error will be thrown
   * @throws {ModelBaseMock.NotFoundError} if throw error on fetch and require are true
   * @return {Promise<AppConfigMock>} this object
   */
  async fetch({require = false} = {}) {
    const that = this;
    return new Promise((resolve, reject) => {
      if (require) {
        reject(ModelBaseMock.NotFoundError);
      } else {
        resolve(that);
      }
    });
  }

  /**
   * Does nothing
   * @return {Promise<void>}
   */
  async save() {}
}

module.exports = ModelBaseMock;
