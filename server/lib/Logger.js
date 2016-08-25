'use strict';
class Logger {
  constructor() {
    this._level = 1;
  }
  setLevel(newLevel) {
    this._level = this._levelToInt(newLevel);
  }
  _levelToInt(level) {
    var result = this._level;
    switch(level) {
      case 'DEBUG':
        result = 0;
        break;
      case 'INFO':
        result = 1;
        break;
      case 'WARN':
        result = 2;
        break;
      case 'ERROR':
        result = 3;
        break;
    }
    return result;
  }
  createHeader(type) {
    var time = new Date();
    return time.toUTCString() + ' [' + type + '] - ';
  }
  debug(msg) {
    if (this._level <= 0) {
      console.log(this.createHeader('DEBUG'), msg);
    }
  }
  info(msg) {
    if (this._level <= 1) {
      console.log(this.createHeader('INFO'), msg);
    }
  }
  warn(msg) {
    if (this._level <= 2) {
      console.log(this.createHeader('WARN'), msg);
    }
  }
  error(msg) {
    if (this._level <= 3) {
      console.log(this.createHeader('ERROR'), msg);
    }
  }
}

var instance = undefined;

function getInstance() {
  if (typeof instance === 'undefined') {
    instance = new Logger();
  }
  return instance;
}

module.exports = {
  getInstance: getInstance
};