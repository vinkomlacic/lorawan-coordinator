/**
 * Initializes vorpal instance.
 */
const {data} = require('ttn');
const vorpal = require('vorpal')();
const {
  TTNCallbacks,
  AppConfigService,
  CoordinatorService,
  NodeService,
} = require('./service')({logger: vorpal});

module.exports = function() {
  let dataClient;
  AppConfigService.initializeAppConfiguration(vorpal)
      .then(() => {
        vorpal
            .command('connect', 'Attaches a handler to TTN events.', {})
            .action(function(args, callback) {
              this.log('Listening for messages...');

              data(process.env.TTN_APP_ID, process.env.TTN_ACCESS_KEY)
                  .then((client) => {
                    dataClient = client;
                    client.on('uplink', TTNCallbacks.onUplink(client));
                    client.on('activation', TTNCallbacks.onActivation(client));
                  })
                  .catch((err) => {
                    this.log(err);
                    this.log('Connection closed');
                    if (dataClient) dataClient.close();
                  });

              callback();
            });

        vorpal
            .command('disconnect', 'Detaches all handlers to TTN events.', {})
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
            .command('nodes', 'Lists all nodes.', {})
            .option('-a, --active', 'List only active nodes.')
            .option('-p, --passive', 'List only passive nodes.')
            .action(async function(args, callback) {
              await NodeService.listNodes({...args.options});
              callback();
            });

        vorpal
            .command('config set <name> <value>', '', {})
            .description('Sets specified app config param value. ' +
              'Note: use quotes on parameter names with more than one word.')
            .action(async function(args, callback) {
              await AppConfigService.setAppConfigParamValueByDisplayName({
                displayName: args.name,
                value: args.value,
              });
              callback();
            });

        vorpal
            .command('config get <name>', '', {})
            .description('Prints specified app config param value.' +
              'Note: use quotes on parameter names with more than one word.')
            .action(async function(args, callback) {
              const mae = await AppConfigService.getAppConfigParamValueByDisplayName({
                displayName: args.name,
              });
              this.log(mae);
              callback();
            });

        vorpal
            .command('config list', 'Prints all configuration options.', {})
            .action(function(args, callback) {
              AppConfigService.printConfigurationParameters();
              callback();
            });

        vorpal
            .command('env', 'Lists all environment variables.', {})
            .action(function(args, callback) {
              this.log(process.env);
              callback();
            });

        vorpal
            .delimiter('coordinator$')
            .show();

        vorpal.log('Lorawan-coordinator attached to host CLI.');
      })
      .catch((error) => {
        vorpal.log(error);
        process.exit();
      });
};
