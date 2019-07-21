'use strict';

module.exports = function buildUpdateAppConfigParam({appConfigDao, validateAppConfigParam}) {
  return async function updateConfigParam({appConfigParam}) {
    const configurationParam = await appConfigDao.getConfigParamByKey(appConfigParam.key);
    await validateAppConfigParam({appConfigParam: configurationParam});
    configurationParam.setValue(appConfigParam.value);

    appConfigDao.update(configurationParam);
  };
};
