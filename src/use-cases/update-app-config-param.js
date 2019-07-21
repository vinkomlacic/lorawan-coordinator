'use strict';

module.exports = function buildUpdateAppConfigParam({appConfigDao, validateAppConfigParam}) {
  return async function updateConfigParam({appConfigParam}) {
    await validateAppConfigParam(appConfigParam);
    const configurationParams = await appConfigDao.getConfigParamByKey(appConfigParam.key);


  };
};

