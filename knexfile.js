// Update with your config settings.
const result = require('dotenv').config();
if (result.error) throw result.error;

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
    },
  },

  staging: {
  },

  production: {
  },

};
