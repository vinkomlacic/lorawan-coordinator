'use strict';
if (process.env.DEBUG) console.log('Debug mode enabled.');

// Initialize database.
const bookshelf = require('./database');

// Initalize models
const models = require('./model');

// Initialize Vorpal CLI.
const result = require('./initVorpal')(bookshelf, models);
if (result.error) throw result.error;
