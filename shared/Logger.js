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

var level = 1;

class Logger {
  static set level(newLevel) {
    level = Logger._levelToInt(newLevel);
  }
  static get level() {
    return level;
  }
  static _levelToInt(level) {
    var result = level;
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
  static createHeader(type) {
    var time = new Date();
    return time.toUTCString() + ' [' + type + '] - ';
  }
  static debug(msg) {
    if (level <= 0) {
      console.log(Logger.createHeader('DEBUG'), msg);
    }
  }
  static info(msg) {
    if (level <= 1) {
      console.log(Logger.createHeader('INFO'), msg);
    }
  }
  static warn(msg) {
    if (level <= 2) {
      console.log(Logger.createHeader('WARN'), msg);
    }
  }
  static error(msg) {
    if (level <= 3) {
      console.log(Logger.createHeader('ERROR'), msg);
    }
  }
}

module.exports = Logger;