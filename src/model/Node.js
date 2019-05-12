const bookshelf = require('../database');

require('./TimePoint');
require('./SensorData');

const Node = bookshelf.Model.extend({
  tableName: 'nodes',
  timePoints: function() {
    return this.hasMany('TimePoint');
  },
  timePoint: function() {
    return this.hasOne('TimePoint');
  },
  nextTimePoint: function() {
    return this.hasOne('TimePoint');
  },
  sensorData: function() {
    return this.hasMany('SensorData');
  },
});

module.exports = bookshelf.model('Node', Node);
