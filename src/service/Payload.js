'use strict';
/**
 * Payload object. Contains byte representation of to be sent payload
 * information.
 */
class Payload {
  /**
   * Creates a payload object. Initializes payload header.
   * @param {Object} initialDataType type of data (part of dataType object)
   */
  constructor(initialDataType) {
    this.dataHexString = '';
    this.dataBuffer = 0;

    this.setDataType(initialDataType);
  }

  /**
   * Sets data type headers
   * @param {Object} dataType one of values from getDataTypes() method
   */
  setDataType(dataType) {
    if (this.dataBuffer > 0) {
      let padding = '';

      while (this.dataBuffer > 0) {
        padding += '0';
      }

      this.dataHexString += padding;
    }

    switch (dataType) {
      case getDataTypes().OFFSET:
        this.dataHexString += getDataType().OFFSET.header;
        this.dataBuffer += getDataTypes().OFFSET.size;
        break;
    }
  }

  /**
   * Sets the value for data.
   * @param {String} hexString hex string representation of byte array
   */
  setDataValue(hexString) {
    while (hexString < this.dataBuffer) {
      hexString = '0' + hexString;
    }

    this.validateHexString(hexString);

    this.dataHexString += hexString;
    this.dataBuffer = 0;
  }

  /**
   * Appends more data to initial data set.
   * @param {Object} dataType type of data from static method
   * @param {String} valueHexString hex string representation of byte array
   */
  appendData(dataType, valueHexString) {
    this.setDataType(dataType);
    this.setDataValue(valueHexString);
  }

  /**
   * Validates if hex string is of valid length and if it contains valid hex
   * characters.
   * @param {String} valueHexString hex string
   * @throws {Error} if hexString length is longer then the allowed buffer or
   * if hexString contains character not from hex set
   */
  validateHexString(valueHexString) {
    if (valueHexString.length != this.dataBuffer) {
      throw new Error('Invalid hex string size.');
    }

    const hexInt = parseInt(valueHexString, 16);

    if (hexInt.toString(16) !== valueHexString) {
      throw new Error('Invalid hex string format.');
    }
  }

  /**
   * @return {String} hexadecimal representation of the payload binary array
   */
  hexString() {
    return this.dataHexString;
  }

  /**
   * @return {Object} contains data type headers
   */
  static getDataTypes() {
    return {
      OFFSET: {
        header: '01',
        size: 3,
      },
    };
  };
}

module.exports = Payload;
