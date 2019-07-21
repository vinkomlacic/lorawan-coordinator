'use strict';
const ValidationError = require('./exceptions/ValidationError');
const makeAppConfigParam = require('./app-config-param');
const makeFakeAppConfigParam =
  require('../../test/fixtures/entities/app-config-param');

const {describe, it} = require('mocha');
const {expect} = require('chai');

describe('app-config-param', () => {
  it('should not allow setting invalid key', () => {
    let appConfigParam = makeFakeAppConfigParam({key: undefined});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);

    appConfigParam = makeFakeAppConfigParam({key: null});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);

    appConfigParam = makeFakeAppConfigParam({key: 17});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);

    appConfigParam = makeFakeAppConfigParam({key: ''});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);
  });

  it('should not allow setting invalid value', () => {
    let appConfigParam = makeFakeAppConfigParam({value: undefined});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);

    appConfigParam = makeFakeAppConfigParam({value: null});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);

    appConfigParam = makeFakeAppConfigParam({value: 33});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);

    appConfigParam = makeFakeAppConfigParam({value: false});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);

    appConfigParam = makeFakeAppConfigParam({value: 1.3});
    expect(() => makeAppConfigParam(appConfigParam)).throws(ValidationError);
  });

  it('should not throw any exceptions', () => {
    const fakeAppConfigParam = makeFakeAppConfigParam();
    let appConfigParam;
    expect(() => appConfigParam = makeAppConfigParam(fakeAppConfigParam)).not.throws();

    expect(appConfigParam.getKey()).equals(fakeAppConfigParam.key);
    expect(appConfigParam.getValue()).equals(fakeAppConfigParam.value);
  });
});
