/**
 * Initializes vorpal instance.
 */
const ttnCallbacks = require('./service/ttnCallbacks');
const {data} = require('ttn');
const vorpal = require('vorpal')();

module.exports = function(bookshelf, models) {
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
        .command('node list', 'Lists all active nodes.')
        .alias('nl')
        .action(async function(args, callback) {
          const nodes = await models.Node.fetchAll();

          nodes.forEach((node) => {
            this.log('Id' + node.get('id'));
            this.log('Dev id: ' + node.get('dev_id'));
            this.log('Node status: ' + node.get('node_status'));
            this.log('Created at: ' + node.get('created_at'));
            this.log('Updated at: ' + node.get('updated_at'));
          });
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
