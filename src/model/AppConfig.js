const bookshelf = require('../database');

const AppConfig = bookshelf.Model.extend({
  tableName: 'app_config',
  idAttribute: 'key',
});

module.exports = bookshelf.model('AppConfig', AppConfig);
