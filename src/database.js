const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE,
    charset: 'utf8',
  },
  debug: process.env.DEBUG,
});

const bookshelf = require('bookshelf')(knex);

// Registry plugin enabled for easier handling of circular dependency issue
bookshelf.plugin('registry');

module.exports = bookshelf;
