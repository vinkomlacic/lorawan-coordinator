'use strict';
const appConfigDao = require('../../test/fixtures/data-access/app-config-dao')({db: null});
const defaultAppConfig = require('../default-app-configuration');
const DatabaseEntityNotFoundError =
  require('../data-access/exceptions/DatabaseEntityNotFoundError');

const loadAppConfig = require('./load-app-config')({
  appConfigDao,
  defaultAppConfig,
  DatabaseEntityNotFoundError,
});

const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

describe('load-app-config', () => {
  it('should not throw any exceptions', async () => {
    await expect(loadAppConfig()).to.be.fulfilled;
  });
});
