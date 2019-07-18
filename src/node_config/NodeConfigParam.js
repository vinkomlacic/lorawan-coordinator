'use strict';
class NodeConfigParam {
  constructor({header, name = '', type = 'uint8', byteSize = 1, signed = false, validator = (value) => true}) {
    this.header = header;
    this.name = name;
    this.byteSize = byteSize;
    this.type = type;
    this.signed = signed;
    this.validator = validator;
  }

  /**
   * @return {string} String representation
   */
  toString() {
    return `${this.header}\t\t\t${this.type}\t\t\t${this.name}`;
  }

  static get SLEEP_PERIOD() {
    return new NodeConfigParam({header: 0x0, name: 'SLEEP_PERIOD', type: 'uint16', byteSize: 2});
  }

  static get OFFSET() {
    // TODO: change type to int16
    return new NodeConfigParam({header: 0x1, name: 'OFFSET', type: 'uint16', byteSize: 2});
  }

  static get ABSOLUTE_TIME() {
    return new NodeConfigParam({header: 0x2, name: 'ABSOLUTE_TIME', type: 'uint32', byteSize: 4});
  }

  static get BACKOFF_TIMEOUT() {
    return new NodeConfigParam({header: 0x3, name: 'BACKOFF_TIMEOUT', type: 'uint16', byteSize: 2});
  }

  static get CONTENTION_WINDOW_MAX() {
    return new NodeConfigParam({header: 0x4, name: 'CONTENTION_WINDOW_MAX'});
  }

  static get REQ_ACK() {
    return new NodeConfigParam({header: 0x5, name: 'REQ_ACK'});
  }

  static get ADR() {
    return new NodeConfigParam({header: 0x6, name: 'REQ_ACK'});
  }

  static get CHANNEL() {
    return new NodeConfigParam({header: 0x7, name: 'CHANNEL'});
  }

  static get SPREADING_FACTOR() {
    return new NodeConfigParam({header: 0x8, name: 'SPREADING_FACTOR'});
  }

  static get BANDWIDTH() {
    return new NodeConfigParam({header: 0x9, name: 'BANDWIDTH'});
  }

  static get CODE_RATE() {
    return new NodeConfigParam({header: 0xA, name: 'CODE_RATE'});
  }

  static get TX_POWER() {
    return new NodeConfigParam({header: 0xB, name: 'TX_POWER'});
  }

  static get RX_PERIOD() {
    return new NodeConfigParam({header: 0xC, name: 'RX_PERIOD'});
  }

  static get RESET() {
    return new NodeConfigParam({header: 13, name: 'RESET'});
  }

  static listParams({logger = console}) {
    logger.log('Params listing: \n');
    logger.log('Code\t\t\tType\t\t\tName\n');
    logger.log(NodeConfigParam.SLEEP_PERIOD.toString());
    logger.log(NodeConfigParam.OFFSET.toString());
    logger.log(NodeConfigParam.ABSOLUTE_TIME.toString());
    logger.log(NodeConfigParam.BACKOFF_TIMEOUT.toString());
    logger.log(NodeConfigParam.CONTENTION_WINDOW_MAX.toString());
    logger.log(NodeConfigParam.REQ_ACK.toString());
    logger.log(NodeConfigParam.ADR.toString());
    logger.log(NodeConfigParam.CHANNEL.toString());
    logger.log(NodeConfigParam.SPREADING_FACTOR.toString());
    logger.log(NodeConfigParam.BANDWIDTH.toString());
    logger.log(NodeConfigParam.CODE_RATE.toString());
    logger.log(NodeConfigParam.TX_POWER.toString());
    logger.log(NodeConfigParam.RX_PERIOD.toString());
    logger.log(NodeConfigParam.RESET.toString());
    logger.log();
  }

  static getParamByName({name}) {
    if (name === 'SLEEP_PERIOD') {
      return NodeConfigParam.SLEEP_PERIOD;
    } else if (name === 'OFFSET') {
      return NodeConfigParam.OFFSET;
    } else if (name === 'ABSOLUTE_TIME') {
      return NodeConfigParam.ABSOLUTE_TIME;
    } else if (name === 'BACKOFF_TIMEOUT') {
      return NodeConfigParam.BACKOFF_TIMEOUT;
    } else if (name === 'CONTENTION_WINDOW_MAX') {
      return NodeConfigParam.CONTENTION_WINDOW_MAX;
    } else if (name === 'REQ_ACK') {
      return NodeConfigParam.REQ_ACK;
    } else if (name === 'ADR') {
      return NodeConfigParam.ADR;
    } else if (name === 'CHANNEL') {
      return NodeConfigParam.CHANNEL;
    } else if (name === 'SPREADING_FACTOR') {
      return NodeConfigParam.SPREADING_FACTOR;
    } else if (name === 'BANDWIDTH') {
      return NodeConfigParam.BANDWIDTH;
    } else if (name === 'CODE_RATE') {
      return NodeConfigParam.CODE_RATE;
    } else if (name === 'TX_POWER') {
      return NodeConfigParam.TX_POWER;
    } else if (name === 'RX_PERIOD') {
      return NodeConfigParam.RX_PERIOD;
    } else if (name === 'RESET') {
      return NodeConfigParam.RESET;
    } else {
      throw new Error('Provided name is invalid');
    }
  }
}

module.exports = NodeConfigParam;
