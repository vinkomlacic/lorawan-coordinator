'use strict';
const IllegalAppConfigParamError = require('./exceptions/IllegalAppConfigParamError');
const appConfigDao = require('../../test/fixtures/data-access/app-config-dao')({db: null});

const makeFakeAppConfigParam = require('../../test/fixtures/entities/app-config-param');
const {makeAppConfigParam} = require('../entities');
const validateAppConfigParam = require('./validate-app-config-param')({appConfigDao});

const {describe, it} = require('mocha');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

describe('validate-app-config', () => {
  it('should not throw any exceptions', async () => {
    const appConfigParam = makeAppConfigParam(makeFakeAppConfigParam());
    await expect(validateAppConfigParam({appConfigParam})).to.be.fulfilled;
  });

  it('should not allow falsy app config param', async () => {
    let appConfigParam = '';
    await expect(validateAppConfigParam({appConfigParam}))
        .to.be.rejectedWith(IllegalAppConfigParamError);

    appConfigParam = null;
    await expect(validateAppConfigParam({appConfigParam}))
        .to.be.rejectedWith(IllegalAppConfigParamError);

    appConfigParam = 0;
    await expect(validateAppConfigParam({appConfigParam}))
        .to.be.rejectedWith(IllegalAppConfigParamError);

    appConfigParam = false;
    await expect(validateAppConfigParam({appConfigParam}))
        .to.be.rejectedWith(IllegalAppConfigParamError);

    appConfigParam = undefined;
    await expect(validateAppConfigParam({appConfigParam}))
        .to.be.rejectedWith(IllegalAppConfigParamError);
  });

  it('should not allow app config param without getKey property', async () => {
    const appConfigParam = {getValue: () => null};
    await expect(validateAppConfigParam({appConfigParam}))
        .to.be.rejectedWith(IllegalAppConfigParamError);
  });

  it('should not allow app config param without getValue property', async () => {
    const appConfigParam = {getKey: () => null};
    await expect(validateAppConfigParam({appConfigParam}))
        .to.be.rejectedWith(IllegalAppConfigParamError);
  });
});
