'use strict';
module.exports = function makeAppConfigParamDbAdapter({bookshelf}) {
  const appConfigParamDbAdapter = bookshelf.Model.extend({
    tableName: 'app-config-params',
  });

  return bookshelf.model('appConfigParamDbAdapter', appConfigParamDbAdapter);
};
