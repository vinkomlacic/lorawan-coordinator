'use strict';
const ValidationError = require('./exceptions/ValidationError');

module.exports = function buildMakeSensorConfigParam({SensorConfigurationAdapter}) {
  return function makeSensorConfigParam({
    key,
    value,
  }) {
    validateKey(key);

    const byteSize = SensorConfigurationAdapter.getByteSizeForKey(key);
    const format = SensorConfigurationAdapter.getFormatForKey(key);

    validateValue(value);

    const createdAt = new Date();
    let updatedAt = new Date();

    return Object.freeze({
      getKey: () => key,
      getByteSize: () => byteSize,
      getFormat: () => format,
      getValue: () => value,
      setValue: (valueValue) => {
        validateValue(valueValue);
        value = valueValue;
        updatedAt = new Date();
      },
      getCreatedAt: () => createdAt,
      getUpdatedAt: () => updatedAt,
    });

    function validateKey(keyValue) {
      if (!key) {
        throw new ValidationError('SensorConfigParam', 'SensorConfigParam must contain key');
      }

      const configurationKeys = SensorConfigurationAdapter.getConfigurationKeys();
      if (!configurationKeys.includes(keyValue)) {
        throw new ValidationError(
            'SensorConfigParam',
            'key does not exist\n' +
            `key: ${keyValue}`
        );
      }
    }

    function validateValue(valueValue) {
      if (!valueValue) {
        throw new ValidationError('SensorConfigParam', 'SensorConfigParam must contain value');
      }

      if (!(typeof valueValue === 'string')) {
        throw new ValidationError(
            'SensorConfigParam',
            'Value must be a string\n' +
            `Provided type: ${typeof valueValue}`
        );
      }

      const hexNumber = Number.parseInt(valueValue, 16);
      const hexString = hexNumber.toString(16);
      if (hexString.toLowerCase() !== valueValue.toLowerCase()) {
        throw new ValidationError(
            'SensorConfigParam',
            'Value is not a valid hex encoded string\n' +
            `Value: ${valueValue}`
        );
      }

      if (valueValue.length !== (byteSize * 2)) {
        throw new ValidationError(
            'SensorConfigParam',
            'Value length and byte size do not match\n' +
            `Value length: ${valueValue.length}\n` +
            `Byte size provided: ${byteSize}`
        );
      }
    }
  };
};
