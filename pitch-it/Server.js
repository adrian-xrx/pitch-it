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
const Logger = require('../shared/Logger');
const Message = require('../shared/Message');
const Authenticator = require('./lib/Authenticator');
const Users = require('./lib/Users');
const Forwarder = require('./lib/Forwarder');

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

  getSocketByUser(user) {
    let socketCount = this._wss.clients.length;
    for (let i = 0; i < socketCount; i++) {
      if (this._wss.clients[i].user === user) {
        return this._wss.clients[i];
      }
    }
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
        if (ws.user) {
          this._users.remove(ws.user);          
        }
        Logger.info('Socket disconnected. Active connections: ' + wss.clients.length);
      });

      Logger.info('New socket connected. Active connections: ' + wss.clients.length);
    });
  }

  _handleMessage(socket, msg) {
    msg = Message.deserialize(msg);
    Logger.debug('Got Message ' + msg.type);
    switch(msg.type) {
      case Message.AUTH_LOGOUT:
        this._authenticator.removeToken(msg.token);
        break;
      case Message.AUTH_CHECK:
        if (this._authenticator.isValid(socket, msg.token)) {
          let user = msg.token.split('.')[1];
          socket.user = user;
          this._users.add(user);
          this._broadcast((socket) => this._users.list(socket));
        }
        break;
      case Message.AUTH_REGISTER:
        this._authenticator.authenticate(socket, msg);
        this._broadcast((socket) => this._users.list(socket));
        break;
      case Message.CALL_OFFER:
      case Message.CALL_ACCEPT:
      case Message.CALL_REJECT:
      case Message.RTC_OFFER:
      case Message.RTC_ANSWER:
      case Message.RTC_ICE_CANDIDATE:
        if (this._authenticator.isValid(socket, msg.token)) {
          let targetSocket = this.getSocketByUser(msg.data.target);
          if (targetSocket) {
            Forwarder.forwardMessageTo(targetSocket, msg, socket);
          } else {
            Logger.error("Target socket does not exist");
            let err = new Message(Message.ERROR, {code: 404, reason: "Target does not exist"});
            socket.send(err.serialize());
          }
        }
        break;
      default:
        Logger.info('Unkown message ' + msg.type);
        break;
    }
  }
}

module.exports = Server;