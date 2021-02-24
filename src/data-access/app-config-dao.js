'use strict';
const {makeAppConfigParam} = require('../entities');
const DatabaseEntityAlreadyExistsError = require('./exceptions/DatabaseEntityAlreadyExistsError');
const NoRowsUpdatedError = require('./exceptions/NoRowsUpdatedError');
const DatabaseEntityNotFoundError = require('./exceptions/DatabaseEntityNotFoundError');

module.exports = function buildMakeAppConfigDao({db}) {
  const {appConfigParamDbAdapter} = db;

  return function makeAppConfigDao() {
    return Object.freeze({
      getKeys: async () => {
        const appConfigParams = await appConfigParamDbAdapter.fetchAll();
        return appConfigParams.map((appConfigParam) => appConfigParam.get('key'));
      },

      getConfigParams: async () => {
        const dbAppConfigParams = await appConfigParamDbAdapter.fetchAll();
        const appConfigParams = [];

        dbAppConfigParams.forEach((dbAppConfigParam) => {
          const appConfigParam = makeAppConfigParam({
            key: dbAppConfigParam.get('key'),
            value: dbAppConfigParam.get('value'),
          });
          appConfigParams.push(appConfigParam);
        });

        return appConfigParams;
      },

      getConfigParamByKey: async (key) => {
        let dbAppConfigParam;
        try {
          dbAppConfigParam = await appConfigParamDbAdapter.forge({'key': key}).fetch();
        } catch (e) {
          throw new DatabaseEntityNotFoundError(
              'AppConfigParam',
              `Entity key: ${key}\n` +
              `Caused by: ${e}`
          );
        }

        return makeAppConfigParam({
          key: dbAppConfigParam.get('key'),
          value: dbAppConfigParam.get('value'),
        });
      },

      save: async (appConfigParam) => {
        try {
          await appConfigParamDbAdapter.forge({
            'key': appConfigParam.getKey(),
            'value': appConfigParam.getValue(),
            'default_value': appConfigParam.getValue(),
          }).save({require: true});
        } catch (e) {
          throw new DatabaseEntityAlreadyExistsError(
              'AppConfigParam',
              `Entity key: ${appConfigParam.getKey()}\n` +
              `Caused by: ${e}`,
          );
        }
      },

      update: async (appConfigParam) => {
        try {
          await appConfigParamDbAdapter.forge({
            'key': appConfigParam.getKey(),
            'value': appConfigParam.getValue(),
            'default_value': appConfigParam.getValue(),
          }).save({method: 'update', require: true});
        } catch (e) {
          throw new NoRowsUpdatedError(`Caused by: ${e}`);
        }
      },
    });
  };
};
