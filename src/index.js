'use strict';

let result = require('dotenv').config();
if (result.error) throw result.error;

if (process.env.DEBUG) console.log('Debug mode enabled.');

// Initialize database.
result = require('./database')();
if (result.error) throw result.error;
const {bookshelf} = result;

// Initialize Vorpal CLI.
result = require('./initVorpal')(bookshelf);
if (result.error) throw result.error;
