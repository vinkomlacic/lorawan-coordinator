'use strict';

module.exports = function buildUpdateAppConfigParam({appConfigDao}) {
  return async function updateConfigParam({appConfigParam}) {
    const configurationParam = await appConfigDao.getConfigParamByKey(appConfigParam.key);
    configurationParam.setValue(appConfigParam.value);

    await appConfigDao.update(configurationParam);
  };
};
