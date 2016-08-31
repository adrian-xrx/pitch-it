/**
 * This code is licensed under the BSD license that can
 * be found in the LICENSE file in the root directory
 * 
 * Authors: J-Pi
 */

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
    logger.debug('List sockets in cache');
    return Object.keys(this._cache);
  }
}

module.exports = SocketCache;