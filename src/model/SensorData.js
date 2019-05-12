const bookshelf = require('../database');

require('./Node');
require('./TimePoint');
const SensorData = bookshelf.Model.extend({
  tableName: 'sensor_data',
  node: function() {
    return this.belongsTo('Node');
  },
  timePoint: function() {
    return this.belongsTo('TimePoint');
  },
});

module.exports = bookshelf.model('SensorData', SensorData);
