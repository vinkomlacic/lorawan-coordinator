/* eslint-disable camelcase */
'use strict';
const ModelBaseMock = require('./ModelBaseMock');

/**
 * Mock object for Node model
 * @see Node
 */
class NodeMock extends ModelBaseMock {
  constructor({
    id,
    time_point_id,
    next_time_point_id,
    dev_id,
    node_status,
    created_at,
    updated_at
  }) {
    super();
    this.id = id;
    this.time_point_id = time_point_id;
    this.next_time_point_id = next_time_point_id;
    this.dev_id = dev_id;
    this.node_status = node_status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  /**
   * Returns
   */
  static collection() {

  }

  /**
   * Sets the attributes
   * @param {number} id
   * @param {number} time_point_id
   * @param {number} next_time_point_id
   * @param {string} dev_id
   * @param {string} node_status
   * @param {Date} created_at
   * @param {Date} updated_at
   */
  set({
    id = this.id,
    time_point_id = this.time_point_id,
    next_time_point_id = this.next_time_point_id,
    dev_id = this.dev_id,
    node_status = this.node_status,
    created_at = this.created_at,
    updated_at = this.updated_at,
  }) {
    this.id = id;
    this.time_point_id = time_point_id;
    this.next_time_point_id = next_time_point_id;
    this.dev_id = dev_id;
    this.node_status = node_status;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

}

module.exports = NodeMock;
