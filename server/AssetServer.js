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
const http = require('http');
const https = require('https');
const path = require('path');
const fs = require('fs');
const express = require('express');
const logger = require('./lib/Logger').getInstance();

class AssetServer {
  constructor(config) {
    let baseApp = express();

    let assetPath = path.join(__dirname + '/asset');
    baseApp.use(express.static(assetPath));

    this._httpServer = http.createServer();
    
    if (config.https) {
      try {
        let key = fs.readFileSync(keyPath).toString();
        let cert = fs.readFileSync(certPath).toString();
        let credentials = {
          key: key,
          cert: cert,
          passphrase: passphrase || null
        };
        this._httpsServer.createServer(credentials);
      } catch (err) {
        logger.error('Error occured while reading credentials ' + err);
        throw new Error("Error reading https certificate or key");
      }
      let httpApp = express();
      httpApp.use((req, res) => {
        let createRedirectUrl = 'https://' + req.hostname;
        createRedirectUrl += (req.port) ? ':' + req.port : '';
        createRedirectUrl += req.originalUrl;
        res.redirect(301, createRedirectUrl);
      });
      this._httpServer.on('request', httpApp);
      this._httpsServer.on('request', baseApp);
    } else {
      this._httpServer.on('request', baseApp);
    }
  }

  launch() {
    this._httpServer.listen(config.port, () => {
      logger.debug('HTTP running on port ' + config.port);
    });
    if (config.https) {
      this._httpsServer.listen(config.https.port, () => {
        logger.debug('HTTPS running on port ' + config.https.port);
      });
    }
  }
}

module.exports = AssetServer;