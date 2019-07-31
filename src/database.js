'use strict';
module.exports = function makeDatabase({knex, bookshelf}) {
  const knexInstance = knex({
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE,
      charset: 'utf8',
    },
    debug: (process.env.DEBUG === '1'),
  });

  const bookshelfInstance = bookshelf(knex);

  // Registry plugin enabled for easier handling of circular dependency issue on model classes
  bookshelfInstance.plugin('registry', null);

  return bookshelfInstance;
};
