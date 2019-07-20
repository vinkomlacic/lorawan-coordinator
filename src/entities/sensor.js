'use strict';
const ValidationError = require('./exceptions/ValidationError');

module.exports = function buildMakeSensor({makeSensorConfig, makeSensorData}) {
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

    // TODO: finish after writing SensorConfig entity
    let sensorConfig = makeSensorConfig();
    let sensorData = [];

    const createdAt = new Date();
    let updatedAt = new Date();

    return Object.freeze({
      getLastGatewayTime: () => lastGatewayTime,
      getNextGatewayTime: () => nextGatewayTime,
      getDevId: () => devId,
      getNodeStatus: () => nodeStatus,
      getSensorConfig: () => sensorConfig,
      getSensorData: () => sensorData,
      getSavedSensorData: () => sensorData.filter((value) => value.isSavedToDb()),
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
      // TODO: add validation
      setSensorConfig: (sensorConfigValue) => {
        sensorConfig = sensorConfigValue;
      },
      addSensorData: (sensorDataValue) => {
        sensorData = [...sensorData, makeSensorData(sensorDataValue)];
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
