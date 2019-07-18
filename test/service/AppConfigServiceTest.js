const chai = require('chai');
chai.use(require('chai-as-promised'));
const {expect} = chai;

const {describe} = require('mocha');

const mockModels = require('../mock/model');
const MockLogger = require('../mock/MockLogger');
const ConfigurationParameter = require('../../src/app_config/ConfigurationParameter');

const now = new Date();
const testConfiguration = {
  TEST_CONFIGURATION_1: new ConfigurationParameter('TEST_CONFIGURATION_1', 15),
  TEST_CONFIGURATION_2: new ConfigurationParameter('TEST_CONFIGURATION_2', 'mock'),
  TEST_CONFIGURATION_3: new ConfigurationParameter('TEST_CONFIGURATION_3', 13.2),
  TEST_CONFIGURATION_4: new ConfigurationParameter('TEST_CONFIGURATION_4', now),
  TEST_CONFIGURATION_5: new ConfigurationParameter('TEST_CONFIGURATION_5', false),
};

const logger = new MockLogger();
const AppConfigService = require('../../src/service/AppConfigService')({
  AppConfig: mockModels.AppConfig,
  configuration: testConfiguration,
  logger,
});

describe('AppConfigService unit tests', () => {
  describe('Initialize app configuration tests', () => {
    it('should initialize the values of config parameters', async () => {
      const initializedConfiguration = await AppConfigService.initializeAppConfiguration();

      for (const configurationParam of Object.keys(initializedConfiguration)) {
        expect(initializedConfiguration[configurationParam].get('key'))
            .to.be.equal(testConfiguration[configurationParam].header);
        expect(initializedConfiguration[configurationParam].get('value'))
            .to.be.equal(testConfiguration[configurationParam].defaultValue);
        expect(initializedConfiguration[configurationParam].get('defaultValue'))
            .to.be.equal(testConfiguration[configurationParam].defaultValue);
      }
    });
  });


  describe('set app configuration param value by display name', () => {
    it('should be fulfilled given correct display name', async () => {
      const validDisplayName = testConfiguration.TEST_CONFIGURATION_1.displayName;
      await expect(AppConfigService.setAppConfigParamValueByDisplayName({
        displayName: validDisplayName,
        value: '',
      })).to.be.fulfilled;
    });

    it('should throw an error given invalid display name', async () => {
      const invalidDisplayName = 'invalid';
      await expect(AppConfigService.setAppConfigParamValueByDisplayName({
        displayName: invalidDisplayName,
        value: '',
      })).to.be.rejectedWith('Invalid display name provided');
    });

    it('should throw an error given undefined display name', async () => {
      await expect(AppConfigService.setAppConfigParamValueByDisplayName({
        value: '',
      })).to.be.rejectedWith('Invalid display name provided');
    });

    it('should throw an error given null display name', async () => {
      await expect(AppConfigService.setAppConfigParamValueByDisplayName({
        displayName: null,
        value: '',
      })).to.be.rejectedWith('Invalid display name provided');
    });
  });

  describe('get configuration param value by display name tests', () => {
    it('should return undefined given correct display name', async () => {
      const validDisplayName = testConfiguration.TEST_CONFIGURATION_1.displayName;
      const result = await AppConfigService.getAppConfigParamValueByDisplayName({
        displayName: validDisplayName,
      });

      expect(result).to.equal(undefined);
    });

    it('should throw an error given invalid display name', async () => {
      const invalidDisplayName = 'invalid';
      await expect(AppConfigService.getAppConfigParamValueByDisplayName({
        displayName: invalidDisplayName,
      })).to.be.rejectedWith('Invalid display name provided');
    });

    it('should throw an error given undefined display name', async () => {
      await expect(AppConfigService.getAppConfigParamValueByDisplayName({}))
          .to.be.rejectedWith('Invalid display name provided');
    });

    it('should throw an error given null display name', async () => {
      await expect(AppConfigService.getAppConfigParamValueByDisplayName({
        displayName: null,
      })).to.be.rejectedWith('Invalid display name provided');
    });
  });

  describe('get app configuration param value by configuration param tests', () => {
    it('should return undefined given correct configuration param', async () => {
      const validConfigurationParam = testConfiguration.TEST_CONFIGURATION_1;
      const result = await AppConfigService
          .getAppConfigParamValueByConfigurationParam(validConfigurationParam);

      expect(result).to.be.equal(undefined);
    });

    it('should throw an error given invalid configuration param', async () => {
      const invalid = new ConfigurationParameter('INVALID', null);

      await expect(AppConfigService.getAppConfigParamValueByConfigurationParam(invalid))
          .to.be.rejectedWith('Non existing configuration param: INVALID');
    });

    it('should throw an error given undefined configuration param', async () => {
      await expect(AppConfigService.getAppConfigParamValueByConfigurationParam(undefined))
          .to.be.rejectedWith('Invalid argument passed: undefined');
    });

    it('should throw an error given null configuration param', async () => {
      await expect(AppConfigService.getAppConfigParamValueByConfigurationParam(null))
          .to.be.rejectedWith('Invalid argument passed: null');
    });
  });

  describe('print configuration parameter display names tests', () => {
    it('should print all configuration parameter display names', () => {
      const expectedOutput =
        'Configuration parameters: \n\n' +
        '\t- test configuration 1\n' +
        '\t- test configuration 2\n' +
        '\t- test configuration 3\n' +
        '\t- test configuration 4\n' +
        '\t- test configuration 5\n' +
        '\n';

      logger.clear();

      AppConfigService.printConfigurationParameters();

      expect(logger.value).to.be.equal(expectedOutput);
    });
  });
});

