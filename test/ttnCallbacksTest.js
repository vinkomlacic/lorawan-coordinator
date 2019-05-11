const {expect} = require('chai');
const ttnCallback = require('../src/ttnCallbacks');

describe('TTN event handler callback tests.', () => {
  const devId = 'testDevId';
  const mockLogger = {
    value: '',
    log: function(data) {
      this.value = data;
    },
  };

  it('should write out sent JSON data', () => {
    const jsonData = {
      a: 'mockDAta1',
      b: 12,
    };

    ttnCallback.onUplink(mockLogger)(devId, jsonData);

    expect(mockLogger.value).to.be.equal(jsonData);
  });
});
