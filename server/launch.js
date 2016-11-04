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
const AssetServer = require('./AssetServer');
const pkg = require('../package.json');
const fs = require('fs');
const Logger = require('../shared/Logger');

function validateConfig(config) {
  let retVal = true;
  if (!config.port) {
    retVal = false;
  }
  return retVal;
}

function launch(config) {
  if (validateConfig(config.assetServer)) {
    new AssetServer(config.assetServer);
  } else {
    console.log('INVALID CONFIG\nEXIT');
  }
}

console.log('\n-------------------------------------------------');
console.log('  pitch it.');
console.log('        Asset Server');
console.log('    v' + pkg.version);
console.log('-------------------------------------------------\n');
let config;
if (process.argv[2]) {
  let configFile = fs.readFileSync(process.argv[2]);
  if (configFile) {
    config = JSON.parse(configFile);
  }
}

if (config) {
  if (config.logLevel) {
    Logger.level = config.logLevel;
  }
  launch(config);
} else {
  console.log('Please, specify a config file');
}
