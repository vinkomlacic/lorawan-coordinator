'use strict';
const ValidationError = require('./exceptions/ValidationError');

module.exports = function makeAppConfigParam({
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
    if (!keyValue) {
      throw new ValidationError('AppConfigParam', 'AppConfigParam must have a key');
    }

    if (typeof keyValue !== 'string') {
      throw new ValidationError(
          'AppConfigParam',
          'Key must be of string type\n' +
          `Key type: ${keyValue}`
      );
    }
  }

  function validateValue(valueValue) {
    if (!valueValue) {
      throw new ValidationError('AppConfigParam', 'AppConfigParam must have a value');
    }

    if (typeof valueValue !== 'string') {
      throw new ValidationError(
          'AppConfigParam',
          'Value must be of string type\n' +
          `Type of value: ${typeof valueValue}`
      );
    }
  }
};
