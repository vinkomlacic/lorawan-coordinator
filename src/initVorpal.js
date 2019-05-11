/**
 * Initializes vorpal instance.
 */
const ttnCallbacks = require('./ttnCallbacks');
const {data} = require('ttn');
const vorpal = require('vorpal')();

module.exports = function(bookshelf) {
  let dataClient;
  try {
    vorpal
        .command('connect', 'Attaches a handler to TTN events.')
        .action(function(args, callback) {
          this.log('Listening for messages...');

          data(process.env.TTN_APP_ID, process.env.TTN_ACCESS_KEY)
              .then((client) => {
                dataClient = client;
                client.on('uplink', ttnCallbacks.onUplink(this, bookshelf));
              })
              .catch((err) => {
                this.log(err);
                this.log('Connection closed');
                if (dataClient) dataClient.close();
              });

          callback();
        });

    vorpal
        .command('disconnect', 'Dettaches all handlers to TTN events.')
        .action(function(args, callback) {
          if (dataClient) {
            dataClient.close();
            this.log('Stopped listening for messages.');
          } else {
            this.log('Not listening for messages.');
          }

          callback();
        });

    vorpal
        .delimiter('coordinator$')
        .show();
  } catch (e) {
    return {
      error: e,
    };
  }

  return {};
};
