'use strict';
const ValidationError = require('./exceptions/ValidationError');

module.exports = function buildMakeSensorConfig({ConfigurationAdapter}) {
  return function makeSensorConfig({
    key,
    value,
  }) {
    validateKey(key);

    const byteSize = ConfigurationAdapter.getByteSizeForKey(key);
    const format = ConfigurationAdapter.getFormatForKey(key);

    validateValue(value);

    const createdAt = new Date();

    return Object.freeze({
      getKey: () => key,
      getByteSize: () => byteSize,
      getFormat: () => format,
      getValue: () => value,
      setValue: (valueValue) => {
        validateValue(valueValue);
        value = valueValue;
      },
      getCreatedAt: () => createdAt,
      getUpdatedAt: () => createdAt,
    });

    function validateKey(keyValue) {
      if (!key) {
        throw new ValidationError('SensorConfig', 'SensorConfig must contain key');
      }

      const configurationKeys = ConfigurationAdapter.getConfigurationKeys();
      if (!configurationKeys.includes(keyValue)) {
        throw new ValidationError(
            'SensorConfig',
            'key does not exist\n' +
            `key: ${keyValue}`
        );
      }
    }

    function validateValue(valueValue) {
      if (!valueValue) {
        throw new ValidationError('SensorConfig', 'SensorConfig must contain value');
      }

      if (!(typeof valueValue === 'string')) {
        throw new ValidationError(
            'SensorConfig',
            'Value must be a string\n' +
            `Provided type: ${typeof valueValue}`
        );
      }

      const hexNumber = Number.parseInt(valueValue, 16);
      const hexString = hexNumber.toString(16);
      if (hexString.toLowerCase() !== valueValue.toLowerCase()) {
        throw new ValidationError(
            'SensorConfig',
            'Value is not a valid hex encoded string\n' +
            `Value: ${valueValue}`
        );
      }

      if (valueValue.length !== (byteSize * 2)) {
        throw new ValidationError(
            'SensorConfig',
            'Value length and byte size do not match\n' +
            `Value length: ${valueValue.length}\n` +
            `Byte size provided: ${byteSize}`
        );
      }
    }
  };
};
