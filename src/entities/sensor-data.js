'use strict';
const ValidationError = require('./exceptions/ValidationError');

// TODO: set limit on the byte size
module.exports = function buildMakeSensorData() {
  return function makeSensorData({
    byteSize = 1,
    value,
  }) {
    validateType(byteSize);
    validateValue(value);

    let isSavedToDb = false;
    const createdAt = new Date();
    let updatedAt = new Date();

    return Object.freeze({
      getByteSize: () => byteSize,
      getValue: () => value,
      isSavedToDb: () => isSavedToDb,
      getCreatedAt: () => createdAt,
      getUpdatedAt: () => updatedAt,
      saved: () => {
        isSavedToDb = true;
        updatedAt = new Date();
      },
    });

    function validateType(byteSizeValue) {
      if (typeof byteSizeValue !== 'number') {
        throw new ValidationError('SensorData', 'Byte size must be a number');
      }

      if (!Number.isInteger(byteSizeValue)) {
        throw new ValidationError('SensorData', 'Byte size must be an integer');
      }

      if (byteSizeValue <= 0) {
        throw new ValidationError('SensorData', 'Byte size must not be negative or zero');
      }
    }

    function validateValue(valueValue) {
      if (!valueValue) {
        throw new ValidationError('SensorData', 'SensorData must contain value');
      }

      if (!(typeof valueValue === 'string')) {
        throw new ValidationError(
            'SensorData',
            'Value must be a string\n' +
            `Provided type: ${typeof valueValue}`
        );
      }

      const hexNumber = Number.parseInt(valueValue, 16);
      const hexString = hexNumber.toString(16);
      if (hexString.toLowerCase() !== valueValue.toLowerCase()) {
        throw new ValidationError(
            'SensorData',
            'Value is not a valid hex encoded string\n' +
            `Value: ${valueValue}`
        );
      }

      if (valueValue.length !== (byteSize * 2)) {
        throw new ValidationError(
            'SensorData',
            'Value length and byte size do not match\n' +
            `Value length: ${valueValue.length}\n` +
            `Byte size provided: ${byteSize}`
        );
      }
    }
  };
};
