'use strict';

const makeFakeSensor = require('../entities/sensor');
const {makeSensor} = require('../../../src/entities');
const DatabaseEntityNotFoundError =
  require('../../../src/data-access/exceptions/DatabaseEntityNotFoundError');

module.exports = function makeSensorConfigDao({db}) {
  let fakeSensors = [
    makeSensor(makeFakeSensor()),
    makeSensor(makeFakeSensor()),
    makeSensor(makeFakeSensor()),
    makeSensor(makeFakeSensor()),
    makeSensor(makeFakeSensor()),
  ];

  return Object.freeze({
    getAllSensors: async () => fakeSensors,
    getSensorByDevId: async (devId) => {
      const sensor = fakeSensors.find((sensor) => sensor.getDevId() === devId);

      if (!sensor) {
        throw new DatabaseEntityNotFoundError('Sensor');
      }

      return sensor;
    },
    getSensorWithLatestNextGatewayTime: async () => {
      let sensor;
      fakeSensors.forEach((fakeSensor) => {
        if (sensor) {
          if (
            sensor.getNextGatewayTime() &&
            fakeSensor.getNextGatewayTime() &&
            sensor.getNextGatewayTime().getTime() < fakeSensor.getNextGatewayTime().getTime()
          ) {
            sensor = fakeSensor;
          }
        } else {
          sensor = fakeSensor;
        }
      });

      if (sensor) {
        return sensor;
      }

      throw new DatabaseEntityNotFoundError('Sensor');
    },
    save: async (object) => fakeSensors.push(object),
    saveOrUpdate: async (object) => object,
    update: async (object) => object,
    deleteAll: async () => fakeSensors = [],
  });
};
