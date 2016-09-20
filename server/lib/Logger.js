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