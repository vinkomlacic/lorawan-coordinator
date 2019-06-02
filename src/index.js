'use strict';
if (process.env.DEBUG) console.log('Debug mode enabled.');

// Initialize database.
const bookshelf = require('./database');
if (bookshelf) console.log('Database initialized.');

// Initalize models
const models = require('./model');
if (models) console.log('Models initialized.');

// Initialize Vorpal CLI.
const result = require('./initVorpal')(bookshelf, models);
if (result.error) throw result.error;
