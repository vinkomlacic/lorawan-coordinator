'use strict';

module.exports = function buildUpdateAppConfigParam({appConfigDao, validateAppConfigParam}) {
  return async function updateConfigParam({appConfigParam}) {
    await validateAppConfigParam(appConfigParam);
    const configurationParam = await appConfigDao.getConfigParamByKey(appConfigParam.key);
    configurationParam.setValue(appConfigParam.value);

    appConfigDao.update(configurationParam);
  };
};
