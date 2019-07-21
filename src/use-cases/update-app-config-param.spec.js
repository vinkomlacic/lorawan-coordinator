'use strict';
const makeFakeAppConfigParam = require('../../test/fixtures/entities/app-config-param');

const appConfigDao = require('../../test/fixtures/data-access/app-config-dao')({db: null});
const validateAppConfigParam = require('./validate-app-config-param')({appConfigDao});
const updateAppConfigParam =
  require('./update-app-config-param')({appConfigDao, validateAppConfigParam});

const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

describe('update-app-config-param', () => {
  it('should not throw any exceptions', async () => {
    const appConfigParam = makeFakeAppConfigParam();
    await expect(updateAppConfigParam({appConfigParam})).to.be.fulfilled;
  });
});
