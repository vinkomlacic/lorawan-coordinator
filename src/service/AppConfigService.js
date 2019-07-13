'use strict';
/**
 * Service used for getting and setting app configuration parameters.
 * @param {Object} AppConfig database model
 * @return {Object} of exposed methods
 */
const AppConfigService = (AppConfig = require('../model/AppConfig')) => {
  class ConfigurationParameter {
    constructor(code, defaultValue) {
      this.code = code;
      this.displayName = code.toLowerCase().replace(' ', '_');
      this.defaultValue = defaultValue;
    }
  }

  const configurationParameters = {
    maximumAllowedError: new ConfigurationParameter('MAXIMUM_ALLOWED_ERROR', 2),
    sleepPeriod: new ConfigurationParameter('SLEEP_PERIOD', 30),
  };

  /**
   * Initializes app_config table. Use this on app startup.
   * Function will not overwrite existing configuration if there is one.
   * @param {Object} logger Logger object.
   * @async
   */
  const initializeAppConfiguration = async (logger) => {
    const maximumAllowedError = new AppConfig({
      key: configurationParameters.maximumAllowedError.code,
    });
    const sleepPeriod = new AppConfig({
      key: configurationParameters.sleepPeriod.code,
    });

    try {
      await maximumAllowedError.fetch({require: true});
      await sleepPeriod.fetch({require: true});

      logger.log('App config already initialized. Skipping initialization.');
    } catch (e) {
      if (e instanceof AppConfig.NotFoundError) {
        logger.log('App config not found or incomplete.');
        logger.log('Initializing app config with default parameters.');

        maximumAllowedError.set({
          key: configurationParameters.maximumAllowedError.code,
          value: configurationParameters.maximumAllowedError.defaultValue,
          default_value: configurationParameters.maximumAllowedError.defaultValue,
        });
        sleepPeriod.set({
          key: configurationParameters.sleepPeriod.code,
          value: configurationParameters.sleepPeriod.defaultValue,
          default_value: configurationParameters.sleepPeriod.defaultValue,
        });

        await maximumAllowedError.save();
        await sleepPeriod.save();

        logger.log('App config initialized.');
      } else {
        logger.log('App config general error.');
        logger.log(e);
      }
    }
  };

  const getMaximumAllowedErrorValue = async () => {
    const maximumAllowedError = await new AppConfig({
      key: configurationParameters.maximumAllowedError.code,
    }).fetch();

    return parseInt(maximumAllowedError.get('value'));
  };

  const setMaximumAllowedErrorValue = async (value) => {
    const maximumAllowedError = await new AppConfig({
      key: configurationParameters.maximumAllowedError.code,
    }).fetch();

    maximumAllowedError.set({value});
    await maximumAllowedError.save();
  };

  const getSleepPeriodValue = async () => {
    const sleepPeriod = await new AppConfig({
      key: configurationParameters.sleepPeriod.code,
    }).fetch();

    return parseInt(sleepPeriod.get('value'));
  };

  const setSleepPeriodValue = async (value) => {
    const sleepPeriod = await new AppConfig({
      key: configurationParameters.sleepPeriod.code,
    }).fetch();

    sleepPeriod.set({value});
    await sleepPeriod.save();
  };

  const printConfigurationParameters = (logger) => {
    logger.log('Configuration parameters: \n');
    Object.keys(configurationParameters).forEach((key) => {
      logger.log('\t- ' + configurationParameters[key].displayName);
    });
    logger.log();
  };

  return {
    initializeAppConfiguration,
    getMaximumAllowedErrorValue,
    setMaximumAllowedErrorValue,
    getSleepPeriodValue,
    setSleepPeriodValue,
    printConfigurationParameters,
  };
};

module.exports = AppConfigService;
