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
const WebSocketServer = require('ws').Server;
const logger = require('../server/lib/Logger').getInstance();
const Message = require('../shared/Message');
const Authenticator = require('./lib/Authenticator');

class Server {
  constructor(config) {
    this._server;
    this._port = config.port;
    this._authenticator = new Authenticator();
    if (config.tls) {
      try {
        let key = fs.readFileSync(keyPath).toString();
        let cert = fs.readFileSync(certPath).toString();
        let credentials = {
          key: key,
          cert: cert,
          passphrase: passphrase || null
        };
        this._server = https.createServer(credentials);
      } catch (err) {
        logger.error("Error reading https certificate or key: " + err);
      }
    } else {
      this._server = http.createServer();
    }

    let wss = new WebSocketServer({
      server: this._server,
      disableHixie: true
    });
    this._setupSocketServer(wss);
  }

  launch() {
    this._server.listen(this._port, () => {
      logger.info('Server is running at port ' + this._port);
    });
  }

  _setupSocketServer(wss) {
    wss.on('connection', (ws) => {
      ws.on('message', (msg) => {
        this._handleMessage(ws, msg);
      });

      ws.on('close', (msg) => {
        logger.info('Socket disconnected. Active connections: ' + wss.clients.length);
      });

      logger.info('New socket connected. Active connections: ' + wss.clients.length);
    });
  }

  _handleMessage(socket, msg) {
    msg = Message.deserialize(msg);
    logger.debug('Got Message ' + msg.type);
    switch(msg.type) {
      case Message.AUTH_REGISTER:
        this._authenticator.authenticate(socket, msg);
        break;
      default:
        logger.info('Unkown message ' + msg.type);
        break;
    }
  }
}

module.exports = Server;