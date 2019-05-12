const bookshelf = require('../database');

const AppConfig = bookshelf.Model.extend({
  tableName: 'app_config',
});

module.exports = bookshelf.model('AppConfig', AppConfig);
