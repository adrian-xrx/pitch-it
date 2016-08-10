'use strict';
var logger = require('./Logger').getInstance();

class SocketCache {

  constructor() {
    this._cache = {};
  }
  
  generateKey() {
    var id = Math.floor((Math.random() * 1000) + 1);
    return id.toString();
  }
  
  add(key, socket) {
    if (this._cache[key]) {
      logger.error('Key ' + key + ' already in use');
      return;
    }
    this._cache[key] = socket;
  }
  
  remove(key) {
    if (this._cache[key]) {
      delete this._cache[key];
    } else {
      logger.warn('Key' + key + ' does not exist');
    }
  }
  
  get(key) {
    logger.debug('Retrive ' + key);
    return this._cache[key];
  }
  
  list() {
    logger.debug('List connected');
    return Object.keys(this._cache);
  }
}

module.exports = SocketCache;