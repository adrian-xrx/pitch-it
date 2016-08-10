'use strict';
let Server = require('./Server');
let pkg = require('../package.json');
let fs = require('fs');

function validateConfig(config) {
  let retVal = true;
  if (!config.port) {
    retVal = false;
  }
  return retVal;
}

console.log('\n-------------------------------------------------');
console.log('  ' + pkg.name);
console.log('    v' + pkg.version);
console.log('-------------------------------------------------\n');

let config = {
  port: 80
};

if (process.argv[2]) {
  let configFile = fs.readFileSync(process.argv[2]);
  if (configFile) {
    config = JSON.parse(configFile);
  }
}

if (validateConfig(config)) {
  new Server(config);
} else {
  console.log('INVALID CONFIG\nEXIT');
}