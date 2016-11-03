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
const Logger = require('./lib/Logger');
const Message = require('../shared/Message');
const Authenticator = require('./lib/Authenticator');
const Users = require('./lib/Users');

class Server {
  constructor(config) {
    this._server;
    this._port = config.port;
    this._users = new Users();
    this._authenticator = new Authenticator(this._users);
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
        Logger.error("Error reading https certificate or key: " + err);
      }
    } else {
      this._server = http.createServer();
    }

    this._wss = new WebSocketServer({
      server: this._server,
      disableHixie: true
    });
    this._setupSocketServer(this._wss);
  }

  launch() {
    this._server.listen(this._port, () => {
      Logger.info('Server is running at port ' + this._port);
    });
  }

  _broadcast(broadcastFunction) {
    this._wss.clients.forEach((client) => {
      broadcastFunction(client);
    });
  }

  _setupSocketServer(wss) {
    wss.on('connection', (ws) => {
      ws.on('message', (msg) => {
        this._handleMessage(ws, msg);
      });

      ws.on('close', (msg) => {
        Logger.info('Socket disconnected. Active connections: ' + wss.clients.length);
      });

      this._broadcast((socket) => this._users.list(socket));
      Logger.info('New socket connected. Active connections: ' + wss.clients.length);
    });
  }

  _handleMessage(socket, msg) {
    msg = Message.deserialize(msg);
    Logger.debug('Got Message ' + msg.type);
    switch(msg.type) {
      case Message.AUTH_REGISTER:
        this._authenticator.authenticate(socket, msg);
        this._broadcast((socket) => this._users.list(socket));
        break;
      default:
        Logger.info('Unkown message ' + msg.type);
        break;
    }
  }
}

module.exports = Server;