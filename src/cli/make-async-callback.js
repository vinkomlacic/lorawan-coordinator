'use strict';
module.exports = function makeAsyncCallback(handlerFunction) {
  return async function(args, callback) {
    await handlerFunction(args);
    callback();
  };
};
