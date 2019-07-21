'use strict';
const ValidationError = require('./exceptions/ValidationError');

module.exports = function makeSensorConfigParam({
  key,
  value,
}) {
  validateKey(key);
  validateValue(value);

  const createdAt = new Date();
  let updatedAt = new Date();

  return Object.freeze({
    getKey: () => key,
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

    if (typeof key !== 'string') {
      throw new ValidationError(
          'SensorConfigParam',
          'Key must be of string type\n' +
          `Key type ${typeof keyValue}`
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
    const hexString = hexNumber.toString(16).padStart(valueValue.length, '0');
    if (hexString.toLowerCase() !== valueValue.toLowerCase()) {
      throw new ValidationError(
          'SensorConfigParam',
          'Value is not a valid hex encoded string\n' +
          `Value: ${valueValue}`
      );
    }
  }
};
