'use strict';
/**
 * Handles creating and fetching time point data.
 * @param {Object} [TimePoint=require('../model/TimePoint')] database model
 * @return {Object} exposed methods
 */
const TimePointService = (TimePoint = require('../model/TimePoint')) => {
  const createNewTimePoint = (timeValue, nodeId = null) => {
    return TimePoint.forge({
      node_id: nodeId,
      time: timeValue,
      collision_detected: false,
    });
  };

  /**
   * Fetches time point with the last time.
   * @async
   */
  const fetchLastTimePoint = async () => {
    return new TimePoint().query((query) => {
      query.select().orderBy('time', 'desc').limit(1);
    }).fetch();
  };

  const createAndSaveNextAvailableTimePoint = async (sleepPeriodSeconds, nodeId = null) => {
    const lastTimePoint = await fetchLastTimePoint();

    const lastTimePointTimeMillis = new Date(lastTimePoint.get('time')).getTime();
    let newTimePointTimeMillis = lastTimePointTimeMillis + sleepPeriodSeconds * 1000;
    while (newTimePointTimeMillis < Date.now()) {
      newTimePointTimeMillis += sleepPeriodSeconds * 1000;
    }

    const newTimePoint = createNewTimePoint(new Date(newTimePointTimeMillis), nodeId);
    await newTimePoint.save();

    return newTimePoint;
  };

  return {
    createNewTimePoint,
    fetchLastTimePoint,
    createAndSaveNextAvailableTimePoint,
  };
};

module.exports = TimePointService;
