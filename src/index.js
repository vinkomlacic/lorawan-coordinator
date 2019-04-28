'use strict'

const result = require('dotenv').config();
if (result.error) throw result.error;

if (process.env.DEBUG) console.log('Debug mode enabled.');

const vorpal = require('vorpal')();
// Example command
vorpal
  .command('foo', 'Outputs "bar".')
  .action(function(args, callback) {
    this.log('bar');
    callback();
  });

vorpal
  .delimiter('coordinator$')
  .show();