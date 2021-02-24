'use strict';
module.exports = function makeCallback(handlerFunction) {
  return function(args, callback) {
    handlerFunction(args);
    callback();
  };
};
