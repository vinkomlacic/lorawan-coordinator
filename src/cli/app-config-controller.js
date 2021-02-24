'use strict';
module.exports = function buildMakeAppConfigController({makeAsyncCallback, makeCallback, appConfigDao}) {
  return function makeAppConfigController() {
    return Object.freeze({
      reloadConfig: () => {

      },
      setAppConfigParam: (key, value) => {

      },
    });
  };
};

