'use strict';
if (process.env.DEBUG === '1') console.log('Debug mode enabled.');

// Initialize database.
const bookshelf = require('./database');
if (bookshelf) console.log('Database initialized.');

// Initialize Vorpal CLI.
const result = require('./initVorpal')();
if (result.error) throw result.error;
