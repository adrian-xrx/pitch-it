/**
 *    Copyright 2016, the creators of pitch-it
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * be found in the LICENSE file in the root directory
 * 
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