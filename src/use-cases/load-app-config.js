'use strict';
const {makeAppConfigParam} = require('../entities/');

module.exports = function buildLoadAppConfig({
  appConfigDao,
  defaultAppConfig,
  DatabaseEntityNotFoundError,
}) {
  return async function loadAppConfig() {
    const appConfigAllowedParamKeys = await appConfigDao.getKeys();

    for (const appConfigParamKey of appConfigAllowedParamKeys) {
      try {
        const appConfigParam = await appConfigDao.getConfigParamByKey(appConfigParamKey);
        await appConfigDao.save(appConfigParam);
      } catch (error) {
        if (error instanceof DatabaseEntityNotFoundError) {
          const appConfigParam = makeAppConfigParam({
            key: appConfigParamKey,
            value: defaultAppConfig[appConfigParamKey],
          });
          await appConfigDao.save(appConfigParam);
        } else {
          throw error;
        }
      }
    }
  };
};
