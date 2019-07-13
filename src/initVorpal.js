/**
 * Initializes vorpal instance.
 */
const {
  TTNCallbacks,
  CoordinatorService,
} = require('./service');
const AppConfigService = require('./service/AppConfigService')();
const NodeService = require('./service/NodeService')();
const {data} = require('ttn');
const vorpal = require('vorpal')();

module.exports = function() {
  let dataClient;
  try {
    AppConfigService.initializeAppConfiguration(vorpal);

    vorpal
        .command('connect', 'Attaches a handler to TTN events.')
        .action(function(args, callback) {
          this.log('Listening for messages...');

          data(process.env.TTN_APP_ID, process.env.TTN_ACCESS_KEY)
              .then((client) => {
                dataClient = client;
                client.on('uplink', TTNCallbacks.onUplink(this, client));
                client.on('activation', TTNCallbacks.onActivation(this, client));
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
        .command('nodes', 'Lists all nodes.')
        .option('-a, --active', 'List only active nodes.')
        .option('-p, --passive', 'List only passive nodes.')
        .action(async function(args, callback) {
          await NodeService.listNodes({
            ...args.options,
            logger: this,
          });
          callback();
        });

    vorpal
        .command('config set maximum_allowed_error', 'Sets maximum allowed error')
        .action(async function(args, callback) {
          await AppConfigService.setMaximumAllowedErrorValue(args[0]);
          callback();
        });

    vorpal
        .command('config set sleep_period', 'Sets the sleep period.')
        .action(async function(args, callback) {
          await AppConfigService.setSleepPeriodValue(args[0]);
          callback();
        });

    vorpal
        .command('config get maximum_allowed_error', 'Prints maximum allowed error.')
        .action(async function(args, callback) {
          const mae = await AppConfigService.getMaximumAllowedErrorValue();
          this.log(mae);
          callback();
        });

    vorpal
        .command('config get sleep_period', 'Prints sleep period.')
        .action(async function(args, callback) {
          const sleepPeriod = await AppConfigService.getSleepPeriodValue();
          this.log(sleepPeriod);
          callback();
        });

    vorpal
        .command('config list', 'Prints all configuration options.')
        .action(function(args, callback) {
          AppConfigService.printConfigurationParameters(this);
          callback();
        });

    vorpal
        .command('env', 'Lists all environment variables.')
        .action(function(args, callback) {
          this.log(process.env);
          callback();
        });

    vorpal
        .command('test', 'Placeholder for testing functions.')
        .action(function(args, callback) {
          CoordinatorService.activate(null, null, this);
          callback();
        });

    vorpal
        .delimiter('coordinator$')
        .show();

    vorpal.log('Lorawan-coordinator attached to host CLI.');
  } catch (e) {
    return {
      error: e,
    };
  }

  return {};
};
