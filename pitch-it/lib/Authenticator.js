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

const Logger = require('../../shared/Logger');
const Message = require('../../shared/Message');

class Authenticator {
  constructor(users) {
    this._tokenCache = {};
    this._users = users;
  }

  cleanup() {
    let toRemove = Object.keys(this._tokenCache).filter((token) => {
      return this._tokenCache[token].expire < Date.now();
    });
    toRemove.forEach((token) => {
      delete this._tokenCache[token];
    });
  }

  generateToken(username) {
    let _set = "abcdefghiljklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 30; i++) {
      let rand = Math.floor(Math.random() * _set.length);
      token += _set[rand];
    }
    token += '.' + username;
    return token;
  }

  authenticate(socket, msg) {
    let token = this.generateToken(msg.data.username);
    this._tokenCache[token] = {
      user: msg.data.username,
      expire: Date.now() + 3600000
    };
    this._users.add(msg.data.username);
    let message = new Message(Message.AUTH_REGISTER, {token: token});
    socket.user = msg.data.username;
    socket.send(message.serialize());
  }

  removeToken(token) {
    let user = token.split('.')[1];
    this._users.remove(user);
    delete this._tokenCache[token];
  }

  isValid(socket, token) {
    let tokenData = this._tokenCache[token];
    if (tokenData && tokenData.expire >= Date.now()) {
      return true;
    } else if (tokenData) {
      this.removeToken(token);
    }
    let err = new Message(Message.ERROR, {code: 401, reason: 'Not authorized'});
    socket.send(err.serialize());
    return false;
  }
}

module.exports = Authenticator;