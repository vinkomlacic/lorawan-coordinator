'use strict';
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

const {describe} = require('mocha');

const mockModels = require('../mock/model');
const MockLogger = require('../mock/MockLogger');

const logger = new MockLogger();
const NodeService = require('../../src/service/NodeService')({
  Node: mockModels.Node,
  logger,
});

