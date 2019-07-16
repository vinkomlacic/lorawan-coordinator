'use strict';
const QueryMock = require('./QueryMock');
/**
 * Collection mock
 */
class CollectionMock {
  constructor(entities) {
    this.entities = [...entities];
    this.queryMock = new QueryMock(this.entities);
  }

  /**
   * @param {Function} callback
   * @return {CollectionMock}
   */
  query(callback) {
    callback(this.queryMock);
    return this;
  }

  /**
   * @return {S[] | T[] | *} queried objects
   */
  fetch() {
    return this.queryMock.queriedObjects;
  }
}

module.exports = CollectionMock;
