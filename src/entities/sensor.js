'use strict';
const ValidationError = require('./exceptions/ValidationError');
const IllegalArgumentError = require('./exceptions/IllegalArgumentError');

module.exports = function buildMakeSensor({makeSensorConfigParam, makeSensorData}) {
  return function makeSensor({
    lastGatewayTime,
    nextGatewayTime,
    devId,
    nodeStatus = 'ACTIVE',
  }) {
    validateLastGatewayTime(lastGatewayTime);
    validateNextGatewayTime(nextGatewayTime);
    validateDevId(devId);
    validateNodeStatus(nodeStatus);

    const sensorConfig = [];
    const sensorData = [];

    const createdAt = new Date();
    let updatedAt = new Date();

    return Object.freeze({
      getLastGatewayTime: () => lastGatewayTime,
      getNextGatewayTime: () => nextGatewayTime,
      getDevId: () => devId,
      getNodeStatus: () => nodeStatus,
      getSensorConfig: () => sensorConfig,
      getSensorData: () => sensorData,
      getCreatedAt: () => createdAt,
      getUpdatedAt: () => updatedAt,
      setNodeStatus: (nodeStatusValue) => {
        validateNodeStatus(nodeStatusValue);
        nodeStatus = nodeStatusValue;
        updatedAt = new Date();
      },
      /**
       * Sets lastGatewayTime as current nextGatewayTime and updates
       * nexGatewayTime with the given argument
       * @param {Date} nextGatewayTimeValue
       */
      setNextGatewayTime: (nextGatewayTimeValue) => {
        validateNextGatewayTime(nextGatewayTimeValue);
        validateLastGatewayTime(nextGatewayTime);
        lastGatewayTime = nextGatewayTime;
        nextGatewayTime = nextGatewayTimeValue;
        updatedAt = new Date();
      },
      addSensorConfigParam: ({key, value}) => {
        const sensorConfigParam = sensorConfig.find((configParam) => {
          return configParam.getKey() === key;
        });

        if (sensorConfigParam) {
          throw new IllegalArgumentError(
              'addSensorConfigParam',
              'Config param already exists\n' +
              `Config param key: ${key}`
          );
        } else {
          const createdSensorConfigParam = makeSensorConfigParam({key, value});
          sensorConfig.push(createdSensorConfigParam);
          return createdSensorConfigParam;
        }
      },
      updateSensorConfigParam: ({key, value}) => {
        const sensorConfigParam = sensorConfig.find((configParam) => {
          return configParam.getKey() === key;
        });

        if (sensorConfigParam) {
          sensorConfigParam.setValue(value);
          return sensorConfigParam;
        } else {
          throw new IllegalArgumentError(
              'updateSensorConfigParam',
              'Config param does not exist\n' +
              `Config param key: ${key}`
          );
        }
      },
      addSensorData: ({byteSize, value}) => {
        const sensorDataUnit = makeSensorData({byteSize, value});
        sensorData.push(sensorDataUnit);
        return sensorDataUnit;
      },
    });

    function validateNodeStatus(nodeStatusValue) {
      const validNodeStatusValues = ['ACTIVE', 'PASSIVE'];

      if (!validNodeStatusValues.includes(nodeStatusValue)) {
        throw new ValidationError(
            'Sensor',
            `Node status must be one of: ${validNodeStatusValues.join(' ')}\n` +
            `Node status: ${nodeStatus}`
        );
      }
    }

    function validateLastGatewayTime(lastGatewayTimeValue) {
      if (
        lastGatewayTimeValue &&
        !(lastGatewayTimeValue instanceof Date)
      ) {
        throw new ValidationError('Sensor', 'Last gateway time must be an instance of Date');
      }
    }

    function validateNextGatewayTime(nextGatewayTimeValue) {
      if (
        nextGatewayTimeValue &&
        !(nextGatewayTimeValue instanceof Date)
      ) {
        throw new ValidationError('Sensor', 'Next gateway time must be an instance of Date');
      }

      // TODO: consider implementing larger diff between times than 0
      if (
        lastGatewayTime &&
        nextGatewayTimeValue &&
        (nextGatewayTimeValue.getTime() - lastGatewayTime.getTime()) <= 0
      ) {
        throw new ValidationError(
            'Sensor',
            'Next gateway time must be after the last gateway time\n' +
            `Last gateway time: ${lastGatewayTime}\n` +
            `Next gateway time: ${nextGatewayTimeValue}`
        );
      }
    }

    function validateDevId(devIdValue) {
      if (!devIdValue) {
        throw new ValidationError('Sensor', 'Sensor must contain devId');
      }

      if (typeof devIdValue != 'string') {
        throw new ValidationError('Sensor', 'DevId must be a string');
      }
    }
  };
};
