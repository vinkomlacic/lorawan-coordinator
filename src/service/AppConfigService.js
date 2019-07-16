'use strict';
/**
 * Service used for getting and setting app configuration parameters.
 * @param {AppConfig} AppConfig database model
 * @param {Object} configuration parameters
 * @param {Object} logger logger object
 * @return {Object} of exposed methods
 */
const AppConfigService = ({
  AppConfig = require('../model/AppConfig'),
  configuration = require('../app_config/Configuration'),
  logger = console,
}) => {
  /**
   * Initializes app_config table. Use this on app startup.
   * Function will not overwrite existing configuration if there is one.
   * @async
   * @return {Promise<any>}
   */
  const initializeAppConfiguration = async () => {
    const appConfigObjects = mapConfigurationToAppConfig(configuration);

    try {
      await checkAppConfigInitialized(appConfigObjects);
      logger.log('App config already initialized. Skipping initialization.');
    } catch (e) {
      logger.log(e);
      logger.log('App config not found or incomplete.');
      logger.log('Initializing app config with default parameters.');

      initializeAppConfigParams(appConfigObjects, configuration);
      await saveAppConfigObjects(appConfigObjects);

      logger.log('App config initialized.');
    }

    return mapAppConfigArrayToObjectWithCodePropertyNames(appConfigObjects);
  };

  /**
   * @param {string} displayName
   * @async
   * @return {Promise<*>} resolves to app config param value
   */
  const getAppConfigParamValueByDisplayName = async ({displayName} = {}) => {
    const key = getConfigurationParamCodeByDisplayName(displayName);
    const appConfig = await new AppConfig({key}).fetch();

    return appConfig.get('value');
  };

  /**
   * @param {ConfigurationParam} configurationParam
   * @async
   * @return {Promise<*>} resolves to app config param value
   */
  const getAppConfigParamValueByConfigurationParam = async (configurationParam) => {
    if (!configurationParam) {
      throw new Error('Invalid argument passed: ' + configurationParam);
    }

    if (configuration[configurationParam.code] === undefined) {
      throw new Error('Non existing configuration param: ' + configurationParam.code);
    }

    const appConfig = await new AppConfig({key: configurationParam.code}).fetch();

    return appConfig.get('value');
  };


  /**
   * @param {string} displayName
   * @param {*} value
   * @async
   */
  const setAppConfigParamValueByDisplayName = async ({
    displayName,
    value,
  } = {}) => {
    const key = getConfigurationParamCodeByDisplayName(displayName);
    const entity = new AppConfig({key, value});
    return entity.save(null, {method: 'update'});
  };

  /**
   * Prints all configuration parameters' display names.
   * Use these when setting and getting configuration params.
   */
  const printConfigurationParameters = () => {
    logger.log('Configuration parameters: \n');
    Object.keys(configuration).forEach((key) => {
      logger.log('\t- ' + configuration[key].displayName);
    });
    logger.log();
  };

  /*
  Methods below are not exposed to outside modules
   */

  const getConfigurationParamCodeByDisplayName = (displayName) => {
    let key = '';
    Object.keys(configuration).forEach((param) => {
      if (configuration[param].displayName === displayName) {
        key = configuration[param].code;
      }
    });

    if (key === '' || !displayName) throw new Error('Invalid display name provided');

    return key;
  };

  const mapConfigurationToAppConfig = (configurationParameters) => {
    return Object.keys(configurationParameters).map((configurationObjectKey) => {
      return new AppConfig({
        key: configurationObjectKey,
      });
    });
  };

  const checkAppConfigInitialized = async (appConfigObjects) => {
    for (const appConfig of appConfigObjects) {
      await appConfig.fetch({require: true});
    }
  };

  const initializeAppConfigParams = (appConfigObjects, params) => {
    let param;
    appConfigObjects.forEach((appConfig) => {
      param = params[appConfig.get('key')];
      appConfig.set({
        value: param.defaultValue,
        defaultValue: param.defaultValue
      });
    });
  };

  const saveAppConfigObjects = async (appConfigObjects) => {
    const promises = appConfigObjects.map((appConfig) => appConfig.save());
    await Promise.all(promises);
  };

  const mapAppConfigArrayToObjectWithCodePropertyNames = (appConfigObjects) => {
    const result = {};
    appConfigObjects.forEach((appConfig) => {
      result[appConfig.get('key')] = appConfig;
    });
    return result;
  };

  return {
    initializeAppConfiguration,
    getAppConfigParamValueByDisplayName,
    getAppConfigParamValueByConfigurationParam,
    setAppConfigParamValueByDisplayName,
    printConfigurationParameters,
  };
};

module.exports = AppConfigService;
