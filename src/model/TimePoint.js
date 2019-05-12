const bookshelf = require('../database');

require('./Node');
require('./SensorData');

const TimePoint = bookshelf.Model.extend({
  tableName: 'time_points',
  node: function() {
    return this.belongsTo('Node');
  },
  sensorData: function() {
    return this.hasOne('SensorData');
  },
});

module.exports = bookshelf.model('TimePoint', TimePoint);
