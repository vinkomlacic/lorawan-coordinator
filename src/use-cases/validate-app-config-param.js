'use strict';
const IllegalAppConfigParam = require('./exceptions/IllegalAppConfigParamError');

module.exports = function buildValidateAppConfigParam({appConfigDao}) {
  return async function validateAppConfigParam({appConfigParam}) {
    const keys = await appConfigDao.getKeys();

    if (!appConfigParam) {
      throw new IllegalAppConfigParam('AppConfigParam must not be falsy');
    }

    if (!appConfigParam.hasOwnProperty('getKey')) {
      throw new IllegalAppConfigParam('AppConfigParam does not have getKey property');
    }

    if (!appConfigParam.hasOwnProperty('getValue')) {
      throw new IllegalAppConfigParam('AppConfigParam does not have getValue property');
    }

    if (!keys.includes(appConfigParam.getKey())) {
      throw new IllegalAppConfigParam('AppConfigParam key does not exist');
    }
  };
};
