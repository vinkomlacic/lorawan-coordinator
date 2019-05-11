const knexInit = require('knex');
const bookshelfInit = require('bookshelf');

/**
 * Initializes database connection with data from .env file.
 * Note: dotenv must be configured before using this.
 * @return {Object} if no error has occurred object is empty,
 * otherwise contains thrown error.
 * @see index.js of this module
 */
module.exports = function() {
  let knex;
  let bookshelf;
  try {
    knex = knexInit({
      client: 'mysql',
      connection: {
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        charset: 'UTF-8',
      },
    });

    bookshelf = bookshelfInit(knex);

    // Registry plugin enabled for easier handling of circular dependency issue
    bookshelf.plugin('registry');
  } catch (e) {
    return {
      error: e,
    };
  }

  return {bookshelf};
};
