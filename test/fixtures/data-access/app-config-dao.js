'use strict';
const defaultAppConfig = require('../../../src/default-app-configuration.json');
const {makeAppConfigParam} = require('../../../src/entities');
const DatabaseEntityNotFoundError =
  require('../../../src/data-access/exceptions/DatabaseEntityNotFoundError');

// TODO: implement with mock database
module.exports = function makeAppConfigDao({db}) {
  const configParams = [];

  return Object.freeze({
    getKeys: async () => Object.keys(defaultAppConfig),
    getConfigParams: async () => {
      for (const configParam of Object.keys(defaultAppConfig)) {
        const createdConfigParam = makeAppConfig({
          key: configParam,
          value: defaultAppConfig[configParam],
        });
        configParams.push(createdConfigParam);
      }

      return configParams;
    },
    getConfigParamByKey: async (key) => {
      if (Object.keys(defaultAppConfig).includes(key)) {
        return makeAppConfigParam({key, value: defaultAppConfig[key]});
      } else {
        throw new DatabaseEntityNotFoundError('AppConfigParam');
      }
    },
    save: async (object) => object,
    saveOrUpdate: async (object) => object,
    update: async (object) => object,
  });
};
