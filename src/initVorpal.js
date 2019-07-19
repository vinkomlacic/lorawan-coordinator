/**
 * Initializes vorpal instance.
 */
const {data} = require('ttn');
const vorpal = require('vorpal')();
const NodeConfigParam = require('./node_config/NodeConfigParam');

const {
  TTNCallbacks,
  AppConfigService,
  CoordinatorService,
  NodeService,
} = require('./service')({logger: vorpal});

module.exports = function() {
  let dataClient;
  let params = null;
  AppConfigService.initializeAppConfiguration(vorpal)
      .then(() => {
        vorpal
            .command('connect', 'Attaches a handler to TTN events.', {})
            .option('-c --coordinate', 'Regulates sleep periods automatically')
            .action(function(args, callback) {
              const self = this;
              this.log('Connecting to TTN...');

              data(process.env.TTN_APP_ID, process.env.TTN_ACCESS_KEY)
                  .then((client) => {
                    dataClient = client;
                    client.on('uplink', TTNCallbacks.onUplink(client));
                    client.on('activation', TTNCallbacks.onActivation(client));
                    self.log('Data client connected.');
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
            .command('send <devId>', '', {})
            .description('Send one of the available node configuration parameters')
            .action(function(args, callback) {
              if (dataClient && params !== null) {
                dataClient.send(args.devId, params.toString('hex').toUpperCase());
              } else if (params === null) {
                this.log('No params to send. Create param buffer first (see: build param)');
              } else {
                this.log('Data client is not connected. Unable to send message (hint: use connect)');
              }

              callback();
            });

        vorpal
            .mode('build param', 'Append param to the object for sending', {})
            .init(function(args, callback) {
              this.log('Append parameter name and value and it will be added to an object for sending');
              callback();
            })
            .delimiter('append: ')
            .action(function(args, callback) {
              const param = args.split(' ');
              let nodeConfigParam;
              try {
                nodeConfigParam = NodeConfigParam.getParamByName({name: param[0]});
              } catch (e) {
                this.log(e.message);
                callback();
                return;
              }

              const buffer = Buffer.alloc(1 + nodeConfigParam.byteSize);
              buffer.writeUInt8(nodeConfigParam.header, 0);
              if (nodeConfigParam.signed === true) {
                buffer.writeIntLE(Number.parseInt(param[1]), 1, nodeConfigParam.byteSize);
              } else {
                buffer.writeUIntLE(Number.parseInt(param[1]), 1, nodeConfigParam.byteSize);
              }

              if (params === null) {
                params = Buffer.from(buffer);
              } else {
                params = Buffer.concat([params, buffer]);
              }
              this.log('Result buffer: ' + params.toString('hex').toUpperCase());
              callback();
            });

        vorpal
            .command('reset param buffer', 'Anulls param buffer', {})
            .action(function(args, callback) {
              params = null;
              callback();
            });

        vorpal
            .command('print param buffer', 'Prints param buffer', {})
            .action(function(args, callback) {
              if (params != null) {
                this.log(`Param buffer: ${params.toString('hex').toUpperCase()}`);
              } else {
                this.log('Param buffer: <empty>');
              }
              callback();
            });

        vorpal
            .command('list params', 'Lists node configuration params', {})
            .action(function(args, callback) {
              NodeConfigParam.listParams({logger: this});
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
