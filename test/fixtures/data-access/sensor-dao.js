'use strict';

const makeFakeSensor = require('../entities/sensor');
const {makeSensor} = require('../../../src/entities');
const DatabaseEntityNotFoundError =
  require('../../../src/data-access/exceptions/DatabaseEntityNotFoundError');

module.exports = function makeSensorConfigDao({db}) {
  const fakeSensors = [
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
    save: async (object) => object,
    saveOrUpdate: async (object) => object,
    update: async (object) => object,
  });
};
